class Morty {
    constructor(name) {
        this.name = name;
    }

    hidePortalGun(boxes, box) {
        boxes[box].hasPortalGun = true
    }

    theoreticalProbability(boxes) {
        return { switch: (boxes - 1) / boxes, stay: 1 / boxes };
    }
}

exports.Morty = Morty