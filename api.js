// Public backend URL only. Credentials and access tokens stay on Flask.
export const API_BASE = 'https://personal-finance-tracker-backend-pak4.onrender.com';

export async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(API_BASE + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    });
  } catch {
    throw new Error('Could not reach the demo server. It may be waking up. Retry shortly; if this persists, check the backend’s FRONTEND_ORIGIN setting.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `The server returned ${response.status}. Please retry.`);
    error.code = data.error;
    throw error;
  }
  return data;
}

export async function importTransactions(onWaiting) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try { return await request('/api/transactions/import', { method: 'POST' }); }
    catch (error) {
      if (error.code !== 'PRODUCT_NOT_READY' || attempt === 5) throw error;
      onWaiting('Plaid is preparing your sample transactions. Retrying shortly…');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}
