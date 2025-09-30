const crypto = require('crypto');

class KeyManager {
    constructor() {
    }

    generateSecretKey() {
        return crypto.randomBytes(32);
    }
}

exports.KeyManager = KeyManager;