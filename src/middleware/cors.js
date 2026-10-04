const PRODUCTION_ORIGINS = [
  'https://baana-main.vercel.app',
  'https://bukkaayyavarlu.org',
  'https://www.bukkaayyavarlu.org',
];

function getAllowedOrigins(configuredOrigins = '') {
  const configured = configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([...configured, ...PRODUCTION_ORIGINS]);
}

function isAllowedOrigin(origin, allowedOrigins) {
  return !origin || allowedOrigins.has(origin);
}

module.exports = { getAllowedOrigins, isAllowedOrigin };
