const { BadRequestErr } = require('./Error');
const { errorTemplate } = require('../utils/constants');

class ParamsValidator {
  constructor(validationSetting, params) {
    this._countParams = validationSetting.countParams;
    this._pattern = validationSetting.pattern;
    this._unverifiedParams = params;
  }

  validateParams() {
    this._checkCountParams();
    const [boxes, path, className] = this._unverifiedParams;
    return {
        countBoxes: (this._checkBoxes(boxes)),
        path: this._checkPath(path),
        class: this._checkClass(className)
    };
  }

  _checkCountParams() {
    if (this._unverifiedParams.length < this._countParams) {
        throw new BadRequestErr(errorTemplate.invalidParams());

    }
  }

  _checkBoxes(param) {
    if (isNaN(parseInt(param, 10)) || param <= 2) {
        throw new BadRequestErr(errorTemplate.invalidBoxes(param));
    }
    return param;
  }

  _checkPath(param) {
    if (!this._pattern.path.test(param)) {
      throw new BadRequestErr(errorTemplate.invalidPath(param));
    }
    return param;
  }

  _checkClass(param) {
    if (!this._pattern.className.test(param) && this._unverifiedParams.length == 3) {
      throw new BadRequestErr(errorTemplate.invalidClass(param));
    }
    return param;
  }
}

module.exports = ParamsValidator;