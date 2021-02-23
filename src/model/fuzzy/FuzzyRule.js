export class FuzzyRule {
    /** @type {Array[]} **/
    expressions = [];

    /**
     *
     * @param expr
     */
    add(...expr) {
        this.expressions.push(expr);
    }

    fire() {
        return Math.max(...this.expressions.map(expr => Math.min(...expr.map(set => set.fuzzyValue))));
    }
}