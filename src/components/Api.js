const readlineSync = require('readline-sync');
const { KeyManager } = require('./KeyManager');
const { FairRandomGenerator } = require('./FairRandomGenerator');
const { Statistics } = require('./Statistics');

const keyManager = new KeyManager();
const fairRandomGenerator = new FairRandomGenerator();
const statistics = new Statistics()

class Api {

    makeBoxes(boxes, countBoxes) {
        if(boxes.length != 0) boxes.splice(0, countBoxes);
        for(let i = 0; i < countBoxes; i++) {
            boxes.push({id: i, hasPortalGun: false, isOpen: false, isSelected: false})
        }
    }

    getFirstPartSecretInfo(countBoxes) {
        const id = this.getSecretInfoStep().length+1;
        const secretKey = this._getSecretKey().toString('hex').toUpperCase();
        const mortyRandomNumber = this._getRundomNumber(countBoxes)
        const HMAC = this._generateHMAC(secretKey, mortyRandomNumber).toUpperCase();
        return { id, secretKey, mortyRandomNumber, HMAC };
    }

    getSecondPartSecretInfo(rickRandomNumber, firstPart, countBoxes) {
        firstPart.rickRandomNumber = rickRandomNumber;
        firstPart.randomBox = (firstPart.mortyRandomNumber + rickRandomNumber)%countBoxes;
        return firstPart;
    }

    _getSecretKey() {
        return keyManager.generateSecretKey();
    }

    _getRundomNumber(countBoxes) {
        return fairRandomGenerator.generateRandonNumber(countBoxes);
    }

    _generateHMAC(secretKey,randomNumber) {
        return fairRandomGenerator.generateHMAC(secretKey,randomNumber).toUpperCase();
    }

    getAnswer(userNname, { patternName, pattern }) {
        let answer
        do {
            answer = this._requestAnswer(userNname);
        } while (!this._validateAnswer(answer, patternName, pattern))
        return isNaN(answer) ? answer : Number(answer);
    }

    _requestAnswer(userNname) {
        return readlineSync.question(`${userNname}: `);
    }

    _validateAnswer(answer, patternName, pattern) {
        if (patternName == 'number') return this._checkNumberAnswer(answer, pattern)
        else return this._checkStringAnswer(answer, pattern)
    }

    _checkNumberAnswer (answer, pattern) {
        return pattern.test(parseInt(answer));
    }

    _checkStringAnswer (answer, pattern) {
        return pattern.test(answer);
    }

    addStartRoundInfo (round) {
        statistics.startRound(round);
    }

    addSecretInfo(secretInfo) {
        statistics.addStep(secretInfo);
    }

    addSwitchedInfo(switchBox) {
        statistics.switched(switchBox);
    }

    addInfoAboutRound(resultRound) {
        statistics.finishRound(resultRound);
    }
    
    getSecretInfoStep() {
        return statistics.currentRound.secretInfoStep;
    }

    getResultInfo(morty, countBoxes) {
        statistics.showResult(morty, countBoxes)
    }
}

exports.Api = Api;