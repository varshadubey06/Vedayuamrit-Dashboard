const authEndpoint = import.meta.env.VITE_ADMIN_AUTH_URL
  || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:3000/api/admin/auth`
    : '/api/admin/auth');

async function requestAuth(
  method: 'GET' | 'POST' | 'DELETE',
  body?: { email: string; password: string },
) {
  let response: Response;
  try {
    response = await fetch(authEndpoint, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      'Cannot reach the admin authentication server. Start the Next.js app on port 3000 and keep it running.',
    );
  }

  let result: { authenticated?: boolean; error?: string } = {};
  try {
    result = await response.json();
  } catch {
    throw new Error('The authentication server returned an invalid response.');
  }

  if (!response.ok && response.status !== 401) {
    throw new Error(result.error || 'Could not contact the authentication server.');
  }

  return { response, result };
}

export async function checkAdminSession() {
  const { response, result } = await requestAuth('GET');
  return response.ok && result.authenticated === true;
}

export async function loginAdmin(email: string, password: string) {
  const { response, result } = await requestAuth('POST', { email, password });
  if (!response.ok) {
    throw new Error(result.error || 'Invalid email or password.');
  }
}

export async function logoutAdmin() {
  const { response } = await requestAuth('DELETE');
  if (!response.ok) {
    throw new Error('Could not sign out. Please try again.');
  }
}
