// Pure functions: no network or page access. Amounts are rounded to cents.
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function filterPeriod(records, period, currency, today = new Date()) {
  const end = localDate(today);
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  startDate.setDate(startDate.getDate() - Number(period) + 1);
  const start = period === 'all' ? null : localDate(startDate);
  return records.filter(row => row.currency === currency &&
    (period === 'all' || (row.date >= start && row.date <= end)));
}

export function summarize(records) {
  const posted = records.filter(row => !row.pending && Number.isFinite(Number(row.amount)));
  const expenses = posted.filter(row => Number(row.amount) > 0);
  const categories = Object.create(null);
  const weekdays = Array(7).fill(0); // Monday first.
  let outflowCents = 0, inflowCents = 0, smallCents = 0, smallCount = 0;
  for (const row of posted) {
    const cents = Math.round(Number(row.amount) * 100);
    if (cents < 0) inflowCents -= cents;
    if (cents <= 0) continue;
    outflowCents += cents;
    const category = row.category || 'OTHER';
    categories[category] = (categories[category] || 0) + cents;
    const day = new Date(`${row.date}T12:00:00`).getDay();
    weekdays[(day + 6) % 7] += cents;
    if (cents < 2000) { smallCents += cents; smallCount++; }
  }
  return {
    spending: outflowCents / 100, income: inflowCents / 100,
    average: expenses.length ? outflowCents / 100 / expenses.length : 0,
    count: posted.length, pending: records.length - posted.length,
    categories: Object.entries(categories).map(([name, cents]) => [name, cents / 100]).sort((a,b) => b[1] - a[1]),
    weekdays: weekdays.map(cents => cents / 100), smallTotal: smallCents / 100, smallCount,
  };
}

export function categoryName(value) {
  return (value || 'OTHER').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

export function money(value, currency) {
  if (/^[A-Z]{3}$/.test(currency)) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value); } catch { /* Unofficial codes fall back below. */ }
  }
  return `${Number(value).toFixed(2)} ${currency}`;
}
