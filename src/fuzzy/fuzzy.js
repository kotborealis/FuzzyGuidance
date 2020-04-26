class FuzzySet {
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
    getCenter(){
        return 0;
    }

    /**
     *
     * @param {Number} x
     * @returns {Number}
     */
    calculateFuzzyValue(x){
        return 0;
    }
}

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

    getArea(){
        const {p1, p2, p3} = this;

        if(!(p3 > p2 && p2 > p1)) return 0;

        if(p1 < 0) {
            const p1_ = 0;
            const p3_ = p3 + (-p1);
            return (p3_ - p1_) / 2;
        }
        else{
            return (p3 - p1) / 2;
        }
    }

    getFuzzyArea() {
        return (1 - (1 - this.fuzzyValue)**2) * this.getArea();
    }

    getCenter(){
        return this.p2;
    }

    calculateFuzzyValue(x){
        this.fuzzyValue = 0;
        this.crispValue = x;

        const {p1, p2, p3} = this;

        if(p3 > p2 && p2 > p1) {
            if(x > p1 && x <= p2) {
                this.fuzzyValue = (x - p1) / (p2 - p1);
            }
            else if(x > p2 && x < p3) {
                this.fuzzyValue = 1.0 - ((x - p2) / (p3 - p2));
            }
        }

        return this.fuzzyValue;
    }
}

export class FuzzySetSMF extends FuzzySet {
    p1;
    p2;

    constructor(p1, p2) {
        super();
        this.p1 = p1;
        this.p2 = p2;
    }

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
    getCenter(){
        return this.p2;
    }

    /**
     *
     * @param {Number} x
     * @returns {Number}
     */
    calculateFuzzyValue(x){
        this.fuzzyValue = 0;
        this.crispValue = x;

        const {p1, p2} = this;

        if(x > p1 && x <= p2) {
            this.fuzzyValue = (x - p1) / (p2 - p1);
        }

        if(x > p2)
            this.fuzzyValue = 1;

        return this.fuzzyValue;
    }
}

export class FuzzyVariable {
    /** @type {[]} **/
    sets = [];


    addSet(name, set) {
        set.name = name;
        this.sets.push(set);
    }


    set(name_){
        return this.sets.filter(({name}) => name === name_)[0];
    }

    ruleFor(name_) {
        return this.sets.filter(({name}) => name === name_)[0].rule;
    }

    /**
     *
     * @param {Number} v
     */
    fuzzyfy(v) {
        this.sets.forEach(fuzzySet => fuzzySet.calculateFuzzyValue(v));
    }

    /**
     *
     * @returns {Number}
     */
    defuzzify() {
        this.fireRules();

        let sumOfWeights = 0;
        let weighedSum = 0;

        this.sets.forEach(fuzzySet => {
            sumOfWeights += fuzzySet.getFuzzyArea() * fuzzySet.getCenter();
            weighedSum += fuzzySet.getFuzzyArea();
        });

        return sumOfWeights === 0 ? 0 : weighedSum / sumOfWeights;
    }

    fireRules() {
        this.sets.forEach(fuzzySet => {
            fuzzySet.fuzzyValue = fuzzySet.rule.fire();
        });
    }
}

export class FuzzyRule {
    /** @type {Array[]} **/
    list = [];

    /**
     *
     * @param {FuzzySet[]} expr
     */
    add(...expr) {
        this.list.push(expr);
    }

    fire() {
        return Math.max(...this.list.map(expr => Math.min(...expr.map(set => set.fuzzyValue))));
    }
}