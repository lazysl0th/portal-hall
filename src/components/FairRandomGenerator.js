const crypto = require('crypto');

class FairRandomGenerator {
    constructor() {
    }

    generateRandonNumber(countBoxes) {
        return crypto.randomInt(Number(countBoxes));
    }

    generateHMAC(secretKey,randomNumber) {
        return crypto.createHmac('sha3-256', secretKey).update(toString(randomNumber)).digest('hex');
    }

}

exports.FairRandomGenerator = FairRandomGenerator;