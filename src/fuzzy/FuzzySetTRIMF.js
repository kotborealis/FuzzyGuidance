import {FuzzySet, FuzzySetBound} from './FuzzySet';

/**
 * @inheritDoc
 * @augments FuzzySet
 */
export class FuzzySetTRIMF extends FuzzySet {
    /**
     *
     * @param {Number} p1
     * @param {Number} p2
     * @param {Number} p3
     */
    constructor(p1, p2, p3) {
        super();
        this.bounds = [new FuzzySetBound(p1, 0), new FuzzySetBound(p2, 1), new FuzzySetBound(p3, 0)];
    }

    getArea() {
        const [p1, p2, p3] = FuzzySetBound.toArrayX(this.bounds);

        if(!(p3 > p2 && p2 > p1)) return 0;

        if(p1 < 0){
            return (p3 + p1) / 2;
        }
        else{
            return (p3 - p1) / 2;
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

        const [p1, p2, p3] = FuzzySetBound.toArrayX(this.bounds);

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