// services/usersService.js
// Very small in-memory user store for demo only.
// In production use a real database and hash passwords.

const users = new Map(); // key: email -> { name, email, phone, pincode, password }

function createUser({ name, email, phone, pincode, password }) {
  if (users.has(email)) {
    const err = new Error('User already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }
  const user = { name, email, phone, pincode, password };
  users.set(email, user);
  return user;
}

function getUserByEmail(email) {
  return users.get(email) || null;
}

module.exports = {
  createUser,
  getUserByEmail
};
