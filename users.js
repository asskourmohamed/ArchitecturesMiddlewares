const bcrypt = require('bcrypt');

// Utilisation de hashSync pour générer les hash de manière synchrone

const users = [
  {
    id: 1,
    username: 'sud1',
    password: bcrypt.hashSync('sud1', saltRounds)
  },
  {
    id: 2,
    username: 'sud2',
    password: bcrypt.hashSync('sud2', saltRounds)
  },
  {
    id: 3,
    username: 'sud3',
    password: bcrypt.hashSync('sud3', saltRounds)
  },
  {
    id: 4,
    username: 'smart3',
    password: bcrypt.hashSync('smart3', saltRounds)
  },
  {
    id: 5,
    username: 'sesnum3',
    password: bcrypt.hashSync('sesnum3', saltRounds)
  },
  {
    id: 6,
    username: 'iccn3',
    password: bcrypt.hashSync('iccn3', saltRounds)
  },
  {
    id: 7,
    username: 'data3',
    password: bcrypt.hashSync('data3', saltRounds)
  },
  {
    id: 8,
    username: 'aseds3',
    password: bcrypt.hashSync('aseds3', saltRounds)
  },
  {
    id: 9,
    username: 'amoa3',
    password: bcrypt.hashSync('amoa3', saltRounds)
  }
];


function findUser(username) {
  return users.find(user => user.username === username);
}

// Fonction pour comparer le mot de passe
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
const saltRounds = 10;
// Fonction utilitaire pour hasher un nouveau mot de passe
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

module.exports = { findUser, users, comparePassword, hashPassword };