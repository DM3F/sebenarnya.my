// Next.js adds `basePath` to <Link> and router.push automatically, but NOT to plain
// <img>, <a>, <video>, next/image `src` strings or metadata icons. Wrap those paths with `withBase`.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const withBase = (path) =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? BASE_PATH + path : path;

// Inverse of withBase: turn a real URL path back into an app path (for comparisons)
export const stripBase = (path) =>
  BASE_PATH && typeof path === 'string' && path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) || '/' : path;
