process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api';
process.env.NEXT_PUBLIC_SOCKET_URL = 'http://localhost:3001';
process.env.PORT = '3000';
require('child_process').execFileSync(
  process.execPath,
  [require.resolve('next/dist/bin/next'), 'dev', '--port', '3000'],
  { stdio: 'inherit', cwd: __dirname }
);
