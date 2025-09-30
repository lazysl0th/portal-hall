const { Api } = require('./Api');
const { gameConfig } = require('../utils/constants');

const api = new Api();

class Core {
    constructor(countBoxes, morty) {
        this._countBoxes = countBoxes;
        this._morty = morty;
        this._boxes = [];
        this._round = 0;
    }

    async run() {
        do {
            this._init();
            await this._start();
            await this._chooseBox();
            await this._deleteBox();
            await this._changeBox();
            await this._finish();
            await this._end()

        }
        while (this._round > 0)
    }

    _init() {
        this._makeBoxes(this._boxes, this._countBoxes);
        this._renderMessages(this._morty.name, gameConfig.phrases.welcomeMessage(this._countBoxes));
        this._updateRound();
        api.addStartRoundInfo(this._round);
    }
    
    async _start() {
        const mortyPartSecretInfo = api.getFirstPartSecretInfo(this._countBoxes);
        this._renderMessages(this._morty.name, `HMAC${mortyPartSecretInfo.id}=${mortyPartSecretInfo.HMAC}`, gameConfig.phrases.enterFirstNumber(this._countBoxes));
        const rickRandomNumber = await api.getAnswer(gameConfig.userName, gameConfig.patternAnswer.chooseBox);
        const secretInfo = api.getSecondPartSecretInfo(rickRandomNumber, mortyPartSecretInfo, this._countBoxes);
        api.addSecretInfo(secretInfo);
        this._morty.hidePortalGun(this._boxes, secretInfo.randomBox);
    }

    async _chooseBox() {
        this._renderMessages(this._morty.name, gameConfig.phrases.chooseBox(this._countBoxes));
        const selectBox = await api.getAnswer(gameConfig.userName, gameConfig.patternAnswer.chooseBox);
        this._selectBox(selectBox, this._boxes);
    }

    async _deleteBox() {
        const mortyPartSecretInfo = api.getFirstPartSecretInfo(this._boxes.filter(box => !box.isSelected).length);
        this._renderMessages(
            this._morty.name, 
            gameConfig.phrases.generateNumber(),
            `HMAC${mortyPartSecretInfo.id}=${mortyPartSecretInfo.HMAC}`,
            gameConfig.phrases.enterSecondNumber(this._boxes.filter(box => !box.isSelected).length)
        );
        const rickRandomNumber = await api.getAnswer(gameConfig.userName, gameConfig.patternAnswer.switchBox);
        const secretInfo = api.getSecondPartSecretInfo(rickRandomNumber, mortyPartSecretInfo, this._boxes.filter(box => !box.isSelected).length);
        api.addSecretInfo(secretInfo);
        this._morty.openBox(this._boxes, secretInfo.randomBox);
    }

    async _changeBox() {
        this._renderMessages(
            this._morty.name,
            gameConfig.phrases.keepBox(
                (this._boxes.filter(box => box.isSelected == true)[0]).id,
                (this._boxes.filter(box => box.isOpen == true)[0]).id
            ),
            gameConfig.phrases.switchBox()
        );
        const switchBox = await api.getAnswer(gameConfig.userName, gameConfig.patternAnswer.switchBox);
        this._switchBox(switchBox, this._boxes);
        api.addSwitchedInfo(switchBox);
    }

    async _finish() {
        const resultRound = this._boxes.filter(box => box.hasPortalGun && box.isSelected).length
        const secretInfoStep = api.getSecretInfoStep();
        secretInfoStep.forEach((step, index) => {
            this._renderMessages(
                this._morty.name,
                gameConfig.phrases.randomNumber(index+1, step.mortyRandomNumber),
                `KEY${step.id}=${step.secretKey}`,
                gameConfig.phrases.fairNumber(index+1, step.mortyRandomNumber, step.rickRandomNumber, this._countBoxes - index, step.randomBox)
            );
        })
        api.addInfoAboutRound(resultRound);
        this._renderMessages(
            this._morty.name,
            gameConfig.phrases.boxWithPortalGun(this._boxes.filter((box) => {if (box.hasPortalGun == true) return box})[0].id),
            (resultRound == 1) ? gameConfig.phrases.win() : gameConfig.phrases.lose()
        )
    }

    async _end() {
        this._renderMessages(this._morty.name, gameConfig.phrases.oneMoreRound())
        const answer = await api.getAnswer(gameConfig.userName, gameConfig.patternAnswer.continueGame);
        this._updateRound(answer);
        if (this._round == 0) {
            this._renderMessages(this._morty.name, gameConfig.phrases.end());
            api.getResultInfo(this._morty, this._countBoxes)
        }
    }

    _makeBoxes(boxes, countBoxes) {
        if(boxes.length != 0) boxes.splice(0, countBoxes);
        for(let i = 0; i < countBoxes; i++) {
            boxes.push({id: i, hasPortalGun: false, isOpen: false, isSelected: false})
        }
    }

    _renderMessages(name, ...texts) {
        texts.forEach(text => console.log(`${name}: ${typeof text === 'object' ? text.text : text}`))
    }

    _updateRound(answer) {
        if (answer == 'n' || answer == 'no') this._round = 0
        else if (answer == undefined) this._round++
    }

    _selectBox(numberBox, boxes) {
        boxes[numberBox].isSelected = true;
    }

    _switchBox(switchBox, boxes) {
        if(switchBox == 0) {
            boxes.filter(box => !box.isSelected).filter(box => !box.isOpen)[0].isSelected = true;
        }
    }
}

exports.Core = Core;