const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node test-hash.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('Hash for password', JSON.stringify(password), ':');
  console.log(hash);
}); 