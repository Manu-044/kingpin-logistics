const net = require('net');

const regions = [
  'ap-south-1',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'eu-west-1',
  'eu-west-2',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1',
  'ap-northeast-2'
];

async function checkRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000); // 2 second timeout
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(6543, host);
  });
}

async function main() {
  for (const region of regions) {
    process.stdout.write(`Checking ${region}... `);
    const success = await checkRegion(region);
    if (success) {
      console.log('✅ FOUND');
      console.log(`\nYour Supabase region is: ${region}`);
      console.log(`Connection string: postgresql://postgres.orzqwpoxiducwjlmuxim:BRpoBqUZXnm5mOtn@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`);
      process.exit(0);
    } else {
      console.log('❌ Failed');
    }
  }
  console.log('\nCould not find the region.');
}

main();
