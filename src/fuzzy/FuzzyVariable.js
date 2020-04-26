export class FuzzyVariable {
    /** @type {[]} **/
    sets = [];


    addSet(name, set) {
        set.name = name;
        this.sets.push(set);
    }


    set(name_) {
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