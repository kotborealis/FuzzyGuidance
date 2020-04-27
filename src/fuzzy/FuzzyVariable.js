export class FuzzyVariable {
    /** @type {Object.<*>} **/
    set = {};

    /** @type {Object.<*>} **/
    rule = {};

    /**
     *
     * @param {Number} v
     */
    fuzzyfy(v) {
        Object.values(this.set).forEach(set => set.calculateFuzzyValue(v));
    }

    /**
     *
     * @returns {Number}
     */
    defuzzify() {
        Object.entries(this.set)
            .forEach(([name, set]) => {
                if(this.rule[name])
                    set.fuzzyValue = this.rule[name].fire();
            });

        let sumOfWeights = 0;
        let weighedSum = 0;

        Object.values(this.set)
            .forEach(set => {
                sumOfWeights += set.getFuzzyArea() * set.getCenter();
                weighedSum += set.getFuzzyArea();
            });

        return sumOfWeights === 0 ? 0 : weighedSum / sumOfWeights;
    }
}