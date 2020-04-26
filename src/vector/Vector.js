export class Vector {
    /** @type {Number} **/
    x;

    /** @type {Number} **/
    y;

    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     *
     * @returns {Number[]}
     */
    coords(){
        return [this.x, this.y];
    }

    /**
     * @returns {Vector}
     */
    copy(){
        return new Vector(this.x, this.y);
    }

    /**
     *
     * @returns {Vector}
     */
    static zero(){
        return new Vector(0, 0);
    }

    /**
     *
     * @returns {Vector}
     */
    negate(){
        return new Vector(-this.x, -this.y);
    }

    /**
     *
     * @returns {Vector}
     */
    static random(lo_x, hi_x, lo_y, hi_y){
        return new Vector(Math.random() * (hi_x - lo_x) + lo_x, Math.random() * (hi_y - lo_y) + lo_y);
    }

    /**
     *
     * @param {Vector} v
     * @returns {Vector}
     */
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
     *
     * @param {Vector} v
     * @returns {Vector}
     */
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /**
     *
     * @param {Vector} v
     * @returns {Number}
     */
    dot(v) {
        return v.x * this.x + v.y * this.y;
    }


    /**
     *
     * @param {Vector} v
     * @returns {Number}
     */
    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }

    /**
     *
     * @param {Vector} v
     * @returns {Number}
     */
    distanceSquared(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }

    /**
     *
     * @returns {Number}
     */
    length() {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     *
     * @returns {Number}
     */
    lengthSquared(){
        return this.x ** 2 + this.y ** 2;
    }

    /**
     *
     * @param {Number} s
     * @returns {Vector}
     */
    multiplyScalar(s){
        return new Vector(this.x * s, this.y * s);
    }

    /**
     *
     * @param {Number} s
     * @returns {Vector}
     */
    divideScalar(s){
        return new Vector(this.x / s, this.y / s);
    }

    /**
     *
     * @param {Vector} v
     * @returns {Vector}
     */
    multiplyVector(v){
        return new Vector(this.x * v.x, this.y * v.y);
    }

    /**
     *
     * @returns {Vector}
     */
    normalize(){
        return this.divideScalar(this.length());
    }

    /**
     * @param {Vector} v
     * @param {Number} delta
     * @returns {Boolean}
     */
    eq(v, delta = 0.00001){
        return Math.abs(v.x - this.x) <= 0.00001 && Math.abs(v.y - this.y) <= 0.00001;
    }
}