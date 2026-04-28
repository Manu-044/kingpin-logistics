const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.orzqwpoxiducwjlmuxim:BRpoBqUZXnm5mOtn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1'
});

client.connect()
  .then(() => {
    console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Query result:', res.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    process.exit(1);
  });
