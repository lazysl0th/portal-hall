const { Morty } = require('../components/Morty');

class LazyMorty extends Morty {
    constructor(name) {
        super(name);
    }

    openBox(boxes) {
        boxes.filter(box => !box.isSelected).filter(box => !box.hasPortalGun)[0].isOpen = true;
    }
}

exports.LazyMorty = LazyMorty;