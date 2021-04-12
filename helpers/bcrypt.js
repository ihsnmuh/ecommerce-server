const bcrypt = require("bcrypt");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(8);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function comparePassword(password, encryptedPassword) {
  return bcrypt.compareSync(password, encryptedPassword);
}

module.exports = { hashPassword, comparePassword };
