const { validationSetting } = require('./utils/constants');
const { MortyLoader } = require('./components/MortyLoader');
const ParamsValidator = require('./components/ParamsValidator');
const { Core } = require('./components/Core');

process.on("uncaughtException", (e) => {console.log(e);e.handler()});

const paramsValidator = new ParamsValidator(validationSetting, process.argv.slice(2));
const config = paramsValidator.validateParams();

const mortyLoader = new MortyLoader(config.path, config.class);
const morty = mortyLoader.createInstance();

const game = new Core(config.countBoxes, morty);

game.run();