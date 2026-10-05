// Normalize old and current email links before the application initializes.
(function () {
  const url = new URL(window.location.href);
  if (url.hash.startsWith('#/')) {
    if (['/', '/index.html'].includes(url.pathname) || /\/auth-callback(?:\.html)?\/?$/.test(url.pathname)) {
      window.location.replace('/sistema.html' + url.hash);
    }
    return;
  }
  const params = new URLSearchParams(url.search);
  new URLSearchParams(url.hash.slice(1)).forEach((value, key) => params.set(key, value));
  const keys = ['access_token', 'refresh_token', 'type', 'code', 'error', 'error_code'];
  const callback = /\/auth-callback(?:\.html)?\/?$/.test(url.pathname);
  if (!callback && !keys.some(key => params.has(key))) return;
  const safeParams = new URLSearchParams();
  keys.forEach(key => { if (params.has(key)) safeParams.set(key, params.get(key)); });
  if (!safeParams.size) safeParams.set('error', 'missing_tokens');
  // Keep credentials in the fragment, never in a request/query or referrer.
  const target = '/sistema.html#/auth-callback?' + safeParams.toString();
  window.location.replace(target);
})();
