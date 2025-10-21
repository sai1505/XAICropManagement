const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2), 'utf8');
}

// Read all users
const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
};

// Write users to file
const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing users:', error);
        return false;
    }
};

// Check if user exists by email
const userExists = (email) => {
    const users = readUsers();
    return users.some(user => user.email === email);
};

// Add new user
const addUser = (userData) => {
    const users = readUsers();
    users.push(userData);
    return writeUsers(users);
};

// Find user by email
const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find(user => user.email === email);
};

module.exports = {
    readUsers,
    writeUsers,
    userExists,
    addUser,
    findUserByEmail
};
