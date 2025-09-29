const crypto = require('crypto');

class KeyManager {
    constructor() {
    }

    generateSecretKey() {
        return crypto.randomBytes(256);
    }
}

exports.KeyManager = KeyManager;