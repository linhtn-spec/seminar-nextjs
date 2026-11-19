const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/

export function localTestOrigin(request: Request) {
  const host = request.headers.get('host') ?? ''
  if (!localHost.test(host) || request.headers.get('origin') !== `http://${host}` ||
    request.headers.get('sec-fetch-site') === 'cross-site') return null
  return `http://${host.replace(/^localhost(?=:|$)/, '127.0.0.1')}`
}
