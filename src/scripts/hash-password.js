const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'kusina2022';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
}

hashPassword();
