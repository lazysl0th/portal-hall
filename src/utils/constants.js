const validationSetting = {
    countParams: 2,
    pattern: {
        path: /^\.{0,2}\/[\w\/]*.js$/,
        className: /^[A-Z]{1}[\w]*/,
    },
}

const errorTemplate = {
    invalidParams: () => ({
        errorMessage: 'Missing required arguments.',
    }),
    invalidBoxes: (boxes) => ({
        errorMessage: `Invalid box count: ${boxes}. The number of boxes must be an integer greater than 2.`,
    }),
    invalidPath: (path) => ({
        errorMessage: `Invalid Morty module path: ${path}. The path must point to a valid .js file.`,
    }),
    invalidClass: (className) => ({
        errorMessage: `Invalid Morty class name: "${className}". Class names must start with an uppercase letter and contain only letters, numbers, or underscores.`
    }),
    moduleNotFound:(path) => ({
        errorMessage: `Morty module not found: "${path}". Check that the file exists and the path is correct.`
    }),
    classNotFound: (className) => ({
        errorMessage: `Morty class not found: "${className}". Make sure the class is exported from the module.`
    }),
    classNotExtends: (className) => ({
        errorMessage: `Invalid Morty class: "${className}" does not extend Morty. All Morty implementations must extend the base Morty class.`
    }),
    invslidTransition: (currentState, nextState) => ({
        errorMessage: `Invalid transition stare ${currentState} → ${nextState}`
    })
}

const gameConfig = {
    phrases: {
        welcomeMessage: (countBoxes) => ({
            text: `Oh geez, Rick, I'm gonna hide your portal gun in one of the ${countBoxes} boxes, okay?`
        }),
        enterFirstNumber: (countBoxes) => ({
            text: `Rick, enter your number [0,${countBoxes}) so you don't whine later that I cheated, alright?`,
        }),
        chooseBox: (countBoxes) => ({
            text: `Okay, okay, I hide the gun. What 's your guess [0,${countBoxes})?`,
        }),
        generateNumber: () => ({
            text: `Let 's , uh, generate another value now, I mean, to select a box to keep in the game.`
        }),
        enterSecondNumber: (countBoxes) => ({
            text: `enter your number [0,${countBoxes}), and, uh, don't say I did n't play fair, okay?`,
        }),
        keepBox: (selectBox, emptyBox) => ({
            text: `I'm keeping the box you chose, I mean ${selectBox}, and the box ${emptyBox}.`,
        }),
        switchBox: () => ({
            text: `You can switch your box (enter 0), or, you know, stick with it (enter 1).`,
        }),
        randomNumber: (index, mortyRandomNumber) => ({
            text: `Aww man, my ${index}st random value is ${mortyRandomNumber}.`,
        }),
        fairNumber: (index, mortyRandomNumber, rickRandomNumber, boxesCount, randomBox) => ({
            text: `So the ${index}st fair number is (${mortyRandomNumber} + ${rickRandomNumber}) % ${boxesCount} = ${randomBox}.`,
        }),
        boxWithPortalGun: (boxWithPortalGun) => ({
            text: `You portal gun is in the box ${boxWithPortalGun}`,
        }),
        lose: () => ({
            text: `Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!`,
        }),
        win: () => ({
            text: `Burrrp! Told ya, Morty. Genius always wins, especially when that genius is me, Rick Sanchez!`
        }),
        oneMoreRound: () => ({
            text: `D-do you wanna play another round (y/n)?`,
        }),
        end: () => ({
            text: `Okay … uh, bye!`,
        })
    },
    userName: 'Rick',
    patternAnswer: {
        continueGame: {
            patternName: 'string',
            pattern: /^(y|yes|n|no)$/i,
        },
        chooseBox: {
            patternName: 'number',
            pattern: /^[0-2]{1}$/ ,
        },
        switchBox: {
            patternName: 'number',
            pattern: /^[0-1]{1}$/ ,
        }
    }
};

module.exports = {validationSetting, errorTemplate, gameConfig}