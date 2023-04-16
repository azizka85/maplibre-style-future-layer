export function trimSlashes(path) {
  return path.replace(/\/$/, '').replace(/^\//, '');
}
