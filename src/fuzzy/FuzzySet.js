import {FuzzyRule} from './FuzzyRule';

export class FuzzySet {
    /** @type {String} **/
    name = "unnamed";


    /** @type {Number} **/
    fuzzyValue = 0;

    /** @type {Number} **/
    crispValue = 0;

    /** @type {FuzzyRule} **/
    rule = new FuzzyRule();

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