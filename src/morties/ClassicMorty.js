const { Morty } = require('../components/Morty');

class ClassicMorty extends Morty {
    constructor(name) {
        super(name);
    }

    openBox(boxes, removeBox) {
        const availableBox = boxes.filter(box => !box.isSelected).filter(box => !box.hasPortalGun);
        if(availableBox.length == 1) {
            availableBox[0].isOpen = true;
        } else {
            availableBox[removeBox].isOpen = true;
        }
    }
}

exports.ClassicMorty = ClassicMorty