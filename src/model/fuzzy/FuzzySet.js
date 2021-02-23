export class FuzzySet {
    /** @type {Number} **/
    fuzzyValue = 0;

    /** @type {FuzzySetBound[]} **/
    bounds = [];

    /**
     *
     * @returns {number}
     */
    getFuzzyArea() {
        return 0;
    }

    /**
     *
     * @returns {number}
     */
    getCenter() {
        return 0;
    }

    /**
     *
     * @param {Number} x
     * @returns {Number}
     */
    calculateFuzzyValue(x) {
        return 0;
    }
}

export class FuzzySetBound {
    /**
     *
     * @type {number}
     */
    x = 0;

    /**
     *
     * @type {number}
     */
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static toArray(bounds) {
        return bounds.map(({x, y}) => [x, y]);
    }

    /**
     *
     * @param {FuzzySetBound[]} bounds
     * @returns {Number[]}
     */
    static toArrayX(bounds) {
        return bounds.map(({x}) => x);
    }
}