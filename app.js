import { request, importTransactions } from './api.js';
import { summarize, filterPeriod, categoryName, money, localDate } from './insights.js';

const $ = id => document.getElementById(id);
const state = { records: [], connected: false, busy: false, page: 1 };
const pageSize = 10;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// All transaction text is placed through textContent, never interpolated into HTML.
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function notify(message, error = false) {
  $('status').textContent = message;
  $('status').classList.toggle('error', error);
  $('status').hidden = !message;
}

function setBusy(busy) {
  state.busy = busy;
  for (const id of ['connect', 'demo-connect', 'refresh', 'add']) $(id).disabled = busy;
  $('import').disabled = busy || !state.connected;
}

function renderConnection() {
  $('connection-label').textContent = state.connected ? 'Sandbox bank connected' : 'Ready for a simulated bank';
  $('connection-description').textContent = state.connected
    ? 'Import the latest fake transactions, or reconnect to another Sandbox bank.'
    : 'Connect to import. Previously saved transactions are still available.';
  $('connection-dot').classList.toggle('connected', state.connected);
  $('connect').textContent = state.connected ? 'Reconnect Sandbox bank ↗' : 'Connect Sandbox bank ↗';
  $('import').disabled = !state.connected || state.busy;
}

async function loadRecords() {
  const data = await request('/api/transactions');
  state.records = data.transactions || [];
  const previous = $('currency').value;
  const currencies = [...new Set(['USD', ...state.records.map(row => row.currency)])].sort();
  $('currency').replaceChildren(...currencies.map(code => {
    const option = element('option', code); option.value = code; return option;
  }));
  $('currency').value = currencies.includes(previous) ? previous : 'USD';
  state.page = 1;
  render();
}

async function refresh() {
  setBusy(true); notify('Loading saved data… The demo server may take a moment to wake up.');
  try {
    const health = await request('/api/health');
    state.connected = health.connected;
    renderConnection();
    await loadRecords();
    notify(state.records.length ? 'Saved transactions are up to date.' : 'You’re ready! Load sample data or add your first fictional cash purchase.');
  } catch (error) { notify(error.message, true); }
  finally { setBusy(false); }
}

async function importAndReload() {
  const result = await importTransactions(notify);
  await loadRecords();
  notify(`Imported ${result.imported} Sandbox transactions. Your dashboard is up to date.`);
}

$('demo-connect').addEventListener('click', async () => {
  setBusy(true); notify('Creating a simulated account and importing fake transactions…');
  try {
    const result = await request('/api/plaid/sandbox-public-token', { method: 'POST' });
    await request('/api/plaid/exchange-token', { method: 'POST', body: { public_token: result.public_token } });
    state.connected = true; renderConnection(); await importAndReload();
  } catch (error) { notify(error.message, true); }
  finally { setBusy(false); }
});

$('connect').addEventListener('click', async () => {
  if (!window.Plaid) { notify('Plaid Link could not load. Check your connection, or use Load sample data.', true); return; }
  setBusy(true); notify('Opening Plaid Sandbox. Use test credentials user_good / pass_good when prompted.');
  let handler;
  try {
    const result = await request('/api/plaid/link-token', { method: 'POST' });
    handler = window.Plaid.create({
      token: result.link_token,
      onSuccess: async publicToken => {
        try {
          await request('/api/plaid/exchange-token', { method: 'POST', body: { public_token: publicToken } });
          state.connected = true; renderConnection(); await importAndReload();
        } catch (error) { notify(error.message, true); }
        finally { handler.destroy(); setBusy(false); }
      },
      onExit: error => {
        notify(error ? 'Sandbox connection did not complete. Try again or load sample data.' : 'Connection cancelled. Your saved data is unchanged.', Boolean(error));
        handler.destroy(); setBusy(false);
      },
    });
    handler.open();
  } catch (error) { notify(error.message, true); setBusy(false); }
});

$('import').addEventListener('click', async () => {
  setBusy(true); notify('Importing fake transactions…');
  try { await importAndReload(); }
  catch (error) {
    if (error.code === 'ACCOUNT_NOT_CONNECTED') { state.connected = false; renderConnection(); }
    notify(error.message, true);
  } finally { setBusy(false); }
});
$('refresh').addEventListener('click', refresh);

function currentRecords() {
  return filterPeriod(state.records, $('period').value, $('currency').value);
}

function render() {
  const rows = currentRecords();
  const totals = summarize(rows);
  const format = amount => money(amount, $('currency').value);
  $('spending').textContent = format(totals.spending);
  $('income').textContent = format(totals.income);
  $('average').textContent = format(totals.average);
  $('count').textContent = totals.count;
  $('pending-note').textContent = `${totals.pending} pending excluded from summaries`;
  renderCategories(totals, format);
  renderWeekdays(totals, format);
  renderInsights(totals, format);
  renderTable(rows, format);
}

function renderCategories(totals, format) {
  const node = $('categories'); node.replaceChildren();
  if (!totals.categories.length) { node.append(element('p', 'No posted outflows in this period. Try a different period or load sample data.', 'empty')); return; }
  const groups = totals.categories.slice(0, 4);
  const remaining = totals.categories.slice(4).reduce((sum, [,amount]) => sum + amount, 0);
  if (remaining) groups.push(['OTHER_CATEGORIES', remaining]);
  for (const [name, amount] of groups) {
    const row = element('div', undefined, 'category-row');
    const label = element('div', undefined, 'category-label');
    label.append(element('span', categoryName(name)), element('span', `${format(amount)} · ${Math.round(amount / totals.spending * 100)}%`));
    const track = element('div', undefined, 'track');
    const fill = element('div', undefined, 'track-fill');
    fill.style.width = `${amount / totals.spending * 100}%`;
    track.append(fill); row.append(label, track); node.append(row);
  }
}

function renderWeekdays(totals, format) {
  const max = Math.max(...totals.weekdays, 1);
  $('weekdays').replaceChildren(...totals.weekdays.map((amount, index) => {
    const column = element('div', undefined, 'day-column');
    const bar = element('div', undefined, `day-bar${amount === max ? ' peak' : ''}`);
    bar.style.height = `${amount / max * 85}%`;
    bar.tabIndex = 0; bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `${days[index]}: ${format(amount)}`);
    bar.append(element('span', format(amount), 'day-value'));
    column.append(bar, element('span', days[index].slice(0, 3), 'day-name')); return column;
  }));
}

function renderInsights(totals, format) {
  const top = totals.categories[0];
  const peak = Math.max(...totals.weekdays);
  const peakDays = days.filter((_, i) => totals.weekdays[i] === peak).join(' & ');
  const descriptions = top ? [
    ['Your biggest category', `${categoryName(top[0])} accounts for ${Math.round(top[1] / totals.spending * 100)}% of outflows (${format(top[1])}). Start here when reviewing your habits.`],
    ['Your spending rhythm', `${peakDays} has the highest total outflow: ${format(peak)}. This is a pattern in the selected records, not a prediction.`],
    ['Small purchases add up', `${totals.smallCount} purchases under ${format(20)} total ${format(totals.smallTotal)}. The little things can be worth keeping track of.`],
  ] : [
    ['Find your biggest category', 'Import sample transactions to see which categories account for the largest share of outflows.'],
    ['Discover your weekly rhythm', 'Your posted transactions will reveal which weekdays have the highest spending totals.'],
    ['Notice the little things', 'Add a fictional cash purchase. Even purchases under 20 currency units contribute to the picture.'],
  ];
  $('insights').replaceChildren(...descriptions.map(([title, description], index) => {
    const card = element('article', undefined, 'insight');
    card.append(element('span', `0${index + 1} / OBSERVATION`, 'insight-index'), element('h3', title), element('p', description));
    return card;
  }));
}

function renderTable(rows, format) {
  const search = $('search').value.trim().toLowerCase();
  const source = $('source').value;
  const filtered = rows.filter(row => (source === 'all' || row.source === source) &&
    `${row.name} ${categoryName(row.category)}`.toLowerCase().includes(search));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  state.page = Math.min(state.page, pageCount);
  const displayed = filtered.slice((state.page - 1) * pageSize, state.page * pageSize);
  $('transaction-rows').replaceChildren(...displayed.map(row => {
    const tr = element('tr');
    const name = element('td', row.name);
    if (row.pending) name.append(element('small', 'Pending'));
    const sourceCell = element('td'); sourceCell.append(element('span', row.source === 'manual' ? 'Manual cash' : 'Sandbox bank', `source-pill ${row.source}`));
    const amount = element('td', `${Number(row.amount) < 0 ? '+' : '−'}${format(Math.abs(Number(row.amount)))}`, `amount${Number(row.amount) < 0 ? ' credit' : ''}`);
    tr.append(name, element('td', row.date), element('td', categoryName(row.category)), sourceCell, amount); return tr;
  }));
  $('table-empty').hidden = filtered.length > 0;
  $('table-empty').textContent = state.records.length ? 'No transactions match these filters.' : 'No transactions yet. Load sample data or add a fictional cash purchase.';
  $('table-count').textContent = `${filtered.length} matching transaction${filtered.length === 1 ? '' : 's'}`;
  $('page-label').textContent = `Page ${state.page} of ${pageCount}`;
  $('previous').disabled = state.page === 1;
  $('next').disabled = state.page === pageCount;
}

for (const id of ['period', 'currency', 'source']) $(id).addEventListener('change', () => { state.page = 1; render(); });
$('search').addEventListener('input', () => { state.page = 1; render(); });
$('previous').addEventListener('click', () => { state.page--; render(); });
$('next').addEventListener('click', () => { state.page++; render(); });
$('add').addEventListener('click', () => {
  $('cash-form').reset(); $('cash-form').elements.date.value = localDate();
  $('form-error').hidden = true; $('cash-dialog').showModal();
});
$('close-dialog').addEventListener('click', () => $('cash-dialog').close());
$('cash-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!$('cash-form').reportValidity()) return;
  const body = Object.fromEntries(new FormData($('cash-form')));
  $('save-cash').disabled = true; $('form-error').hidden = true;
  try {
    const saved = await request('/api/transactions', { method: 'POST', body });
    // Update from the successful write directly; a later failed read must not
    // prompt the user to save the same purchase a second time.
    state.records.unshift(saved);
    if (![...$('currency').options].some(option => option.value === saved.currency)) {
      const option = element('option', saved.currency); option.value = saved.currency; $('currency').append(option);
    }
    $('currency').value = saved.currency; $('period').value = 'all';
    $('source').value = 'all'; $('search').value = ''; state.page = 1;
    render(); $('cash-dialog').close(); notify('Cash purchase saved to the shared demo database.');
  } catch (error) { $('form-error').textContent = error.message; $('form-error').hidden = false; }
  finally { $('save-cash').disabled = false; }
});

render();
refresh();
