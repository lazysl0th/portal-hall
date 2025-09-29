const Table = require('cli-table3');

class Statistics {
    constructor() {
        this.rounds = [];
        this.currentRound = null;
    }

    startRound(roundNumber) {
        this.currentRound = { roundNumber: roundNumber, secretInfoStep: [], stayed: { round: 0, win: 0 }, switched: { round: 0, win: 0 } };
    }

    addStep(secretInfo) {
        if (this.currentRound) this.currentRound.secretInfoStep.push(secretInfo);
    }

    switched(switchBox) {
        if (switchBox == 0) this.currentRound.switched.round++;
        else this.currentRound.stayed.round++;
    }

    finishRound(result) {
        if (result == 1) {
            if (this.currentRound.stayed.round != 0) {
                this.currentRound.stayed.win++;
            } else {
                this.currentRound.switched.win++
            };
        }
        this.rounds.push(this.currentRound);
        this.currentRound = null;
    }

    showResult(morty, countBoxes) {
        const table = new Table({
            head: ['Game results', 'Rick switched', 'Rick stayed'],
            colWidths: [20, 15, 15]
        });

        const roundsStayed = this.rounds.reduce((sum, round) => sum + round.stayed.round, 0)
        const roundsStayedWin = this.rounds.reduce((sum, round) => sum + round.stayed.win, 0)
        const roundsSwitched = this.rounds.reduce((sum, round) => sum + round.switched.round, 0)
        const roundsSwitchedWin = this.rounds.reduce((sum, round) => sum + round.switched.win, 0)

        const pESwitch = roundsSwitched ? (roundsSwitchedWin / roundsSwitched) : 0;
        const pEStay = roundsStayed ? (roundsStayedWin / roundsStayed) : 0;
        const pT = morty.theoreticalProbability(countBoxes)
        

        table.push(
            ['Rounds', roundsSwitched, roundsStayed],
            ['Wins', roundsSwitchedWin, roundsStayedWin],
            ['P (empirical)', (pESwitch).toFixed(3), (pEStay).toFixed(3)],
            ['P (theoretical)', (pT.switch).toFixed(3), (pT.stay).toFixed(3)]
        );

        console.log(table.toString());
    }
}

exports.Statistics = Statistics