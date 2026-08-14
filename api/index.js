export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);

  let targetHost = 'chatgpt.com';
  if (url.pathname.startsWith('/auth') || url.pathname.includes('oauth')) {
    targetHost = 'auth.openai.com';
  }

  url.hostname = targetHost;
  url.protocol = 'https:';
  url.port = '';

  const headers = new Headers(request.headers);
  headers.set('Host', targetHost);
  headers.set('Origin', `https://${targetHost}`);
  headers.set('Referer', `https://${targetHost}/`);

  return fetch(url.toString(), {
    method: request.method,
    headers: headers,
    body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : undefined,
    redirect: 'follow',
  });
}
