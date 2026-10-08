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

// Describe purchase sizes and repeated merchant names without inferring
// subscriptions, intent, or spending outside the imported history.
export function analyzePurchases(records) {
  const purchases = records.filter(row => !row.pending && Number(row.amount) > 0
    && Number.isFinite(Number(row.amount)));
  const amounts = purchases.map(row => Math.round(Number(row.amount) * 100)).sort((a, b) => a - b);
  const middle = Math.floor(amounts.length / 2);
  const medianCents = amounts.length === 0 ? 0 : amounts.length % 2
    ? amounts[middle] : (amounts[middle - 1] + amounts[middle]) / 2;
  const bands = [
    { label: 'Under 20', min: 0, max: 2000, count: 0, cents: 0 },
    { label: '20 to under 100', min: 2000, max: 10000, count: 0, cents: 0 },
    { label: '100 and above', min: 10000, max: Infinity, count: 0, cents: 0 },
  ];
  const merchants = new Map();
  const dates = new Set();
  let largest = null;
  for (const row of purchases) {
    const cents = Math.round(Number(row.amount) * 100);
    const band = bands.find(group => cents >= group.min && cents < group.max);
    band.count++; band.cents += cents;
    dates.add(row.date);
    if (!largest || Number(row.amount) > Number(largest.amount)) largest = row;
    const key = row.name.trim().toLowerCase();
    if (!merchants.has(key)) merchants.set(key, { name: row.name, count: 0, cents: 0 });
    const merchant = merchants.get(key);
    merchant.count++; merchant.cents += cents;
  }
  return {
    count: purchases.length, median: medianCents / 100, largest, activeDays: dates.size,
    bands: bands.map(({ label, count, cents }) => ({ label, count, total: cents / 100 })),
    merchants: [...merchants.values()].filter(group => group.count >= 2)
      .sort((a, b) => b.count - a.count || b.cents - a.cents)
      .map(({ name, count, cents }) => ({ name, count, total: cents / 100 })),
  };
}

export function money(value, currency) {
  if (/^[A-Z]{3}$/.test(currency)) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value); } catch { /* Unofficial codes fall back below. */ }
  }
  return `${Number(value).toFixed(2)} ${currency}`;
}
