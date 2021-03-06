import {FuzzySet, FuzzySetBound} from './FuzzySet';

/**
 * @inheritDoc
 * @augments FuzzySet
 */
export class FuzzySetLIMFN extends FuzzySet {
    /**
     *
     * @param {Number} p1
     * @param {Number} p2
     */
    constructor(p1, p2) {
        super();
        this.bounds = [new FuzzySetBound(p1, 1), new FuzzySetBound(p2, 0)];
    }

    getArea() {
        const [p1, p2] = FuzzySetBound.toArrayX(this.bounds);

        if(p1 > p2) return 0;

        if(p1 < 0){
            return (p2 + p1) / 2;
        }
        else{
            return (p2 - p1) / 2;
        }
    }

    getFuzzyArea() {
        return (1 - (1 - this.fuzzyValue) ** 2) * this.getArea();
    }

    getCenter() {
        return this.bounds[1].x;
    }

    calculateFuzzyValue(x) {
        this.fuzzyValue = 0;

        const [p1, p2] = FuzzySetBound.toArrayX(this.bounds);

        if(x <= p1) this.fuzzyValue = 1;
        else if(x >= p2) this.fuzzyValue = 0;
        else this.fuzzyValue = (p2 - x) / (p2 - p1);

        return this.fuzzyValue;
    }
}