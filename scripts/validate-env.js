import process from 'node:process';

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
];

console.log('⚡ High Draw Golf — Automated Pre-Build Environment Check...');

let missing = false;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️ Warning: Missing environment variable ${envVar}. Falling back to default configuration.`);
    missing = true;
  }
}

if (!missing) {
  console.log('✅ All required environment variables verified!');
} else {
  console.log('ℹ️ Proceeding with build using standard defaults.');
}
