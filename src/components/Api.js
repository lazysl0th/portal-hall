const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
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
        const secretKey = this._getSecretKey();
        const mortyRandomNumber = this._getRundomNumber(countBoxes)
        const HMAC = this._generateHMAC(secretKey, mortyRandomNumber).toUpperCase();
        return { secretKey, mortyRandomNumber, HMAC };
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

    async getAnswer(userNname, { patternName, pattern }) {
        let answer;
        while (!this._validateAnswer(answer, patternName, pattern)) {
            answer = await this._requestAnswer(userNname);
        }
        return isNaN(answer) ? answer : Number(answer);
    }

    async _requestAnswer(userNname) {
        const rl = readline.createInterface({ input, output });
        const answer = await rl.question(`${userNname}: `);
        rl.close();
        return answer;
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