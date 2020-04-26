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