
const toUnderscoreCase = (s) => s
  .replace(/\.?([A-Z]+)/g, '_$1')
  .replace(/^_/, '')
  .replace(/-/g, '_');

export default {
  toUnderscoreCase,
};
