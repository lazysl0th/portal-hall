const path = require('path');
const { BadRequestErr } = require('./Error');
const { errorTemplate } = require('../utils/constants');
const { Morty } = require('./Morty');

class MortyLoader {
    constructor(path, className) {
        this._path = path;
        this._class = className;
    }

    _loadModule() {
        try {
            return require(path.resolve(process.cwd(), this._path));
        } catch (e) {
            if (!e.handler) throw new BadRequestErr(errorTemplate.moduleNotFound(this._path))
        }
    }

    _resolveClass(module) {
        const MortyClass = this._class ? module[this._class] : Object.values(module)[0];
        if (!MortyClass) throw new BadRequestErr(errorTemplate.classNotFound(this._class));
        return MortyClass;
    }

    _validateClass(mortyInstance) {
        if (!(mortyInstance.prototype instanceof Morty)) throw new BadRequestErr(errorTemplate.classNotExtends(this._class));
    }

    createInstance() {
        const module = this._loadModule();
        const MortyClass = this._resolveClass(module);
        this._validateClass(MortyClass);
        const Morty = new MortyClass(this._class);
        return Morty;
    }

}

exports.MortyLoader = MortyLoader