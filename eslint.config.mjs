import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const asArray = (c) => (Array.isArray(c) ? c : [c]);

const config = [
  ...asArray(nextCoreWebVitals),
  ...asArray(nextTypescript),
  { ignores: ['measure/**', '.next/**', 'node_modules/**', 'public/**'] },
];

export default config;
