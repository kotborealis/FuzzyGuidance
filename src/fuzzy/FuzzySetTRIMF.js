import {FuzzySet} from './FuzzySet';

export class FuzzySetTRIMF extends FuzzySet {
    /** @type {Number} **/
    p1;

    /** @type {Number} **/
    p2;

    /** @type {Number} **/
    p3;

    /**
     *
     * @param {Number} p1
     * @param {Number} p2
     * @param {Number} p3
     */
    constructor(p1, p2, p3) {
        super();
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    getArea() {
        const {p1, p2, p3} = this;

        if(!(p3 > p2 && p2 > p1)) return 0;

        if(p1 < 0){
            const p1_ = 0;
            const p3_ = p3 + (-p1);
            return (p3_ - p1_) / 2;
        }
        else{
            return (p3 - p1) / 2;
        }
    }

    getFuzzyArea() {
        return (1 - (1 - this.fuzzyValue) ** 2) * this.getArea();
    }

    getCenter() {
        return this.p2;
    }

    calculateFuzzyValue(x) {
        this.fuzzyValue = 0;
        this.crispValue = x;

        const {p1, p2, p3} = this;

        if(p3 > p2 && p2 > p1){
            if(x > p1 && x <= p2){
                this.fuzzyValue = (x - p1) / (p2 - p1);
            }
            else if(x > p2 && x < p3){
                this.fuzzyValue = 1.0 - ((x - p2) / (p3 - p2));
            }
        }

        return this.fuzzyValue;
    }
}