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

async function checkPooler(region) {
  return new Promise((resolve) => {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const socket = new net.Socket();
    
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      // Send Postgres StartupMessage
      // Length: 8 bytes, Protocol: 3.0 (196608)
      // We just need to see if it responds or drops us
      // Actually we just need to send a valid startup message
      // and see if the server responds with an Auth request
      const buffer = Buffer.alloc(80);
      let offset = 0;
      buffer.writeInt32BE(0, offset); offset += 4; // length placeholder
      buffer.writeInt32BE(196608, offset); offset += 4; // protocol
      
      const writeString = (str) => {
        buffer.write(str, offset); offset += str.length;
        buffer.writeInt8(0, offset); offset += 1; // null terminator
      };
      
      writeString('user');
      writeString('postgres.orzqwpoxiducwjlmuxim');
      writeString('database');
      writeString('postgres');
      buffer.writeInt8(0, offset); offset += 1;
      
      buffer.writeInt32BE(offset, 0); // write total length
      
      socket.write(buffer.slice(0, offset));
    });
    
    socket.on('data', (data) => {
      // If it starts with 'R' it's an Authentication request
      // If it's an ErrorResponse ('E'), it might mean wrong tenant/region
      const type = String.fromCharCode(data[0]);
      socket.destroy();
      
      if (type === 'R') {
        resolve(true); // Found!
      } else {
        resolve(false);
      }
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(6543, host);
  });
}

async function findRegion() {
  console.log('Scanning regions...');
  for (const region of regions) {
    process.stdout.write(`Checking ${region}... `);
    const success = await checkPooler(region);
    if (success) {
      console.log('SUCCESS!');
      console.log(`Found pooler: aws-0-${region}.pooler.supabase.com`);
      process.exit(0);
    } else {
      console.log('failed.');
    }
  }
  console.log('Could not find region.');
}

findRegion();
