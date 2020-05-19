import {Vector} from '../vector/Vector';

export class Aircraft {
    /** @type {Vector} **/
    position;

    /** @type {Vector[]} **/
    trajectory = [];

    /** @type{Number} **/
    trajectory_limit = 500;

    /** @type {Number} **/
    speed;

    /** @type {Number} **/
    angle;

    /** @type {Number} **/
    angleSpeed = 0;

    /**
     *
     * @param {Vector} position
     * @param {Number} speed
     * @param {Number} angle
     */
    constructor(position = Vector.zero(), speed = 0, angle = 0, angleSpeed = 0) {
        this.position = position;
        this.speed = speed;
        this.angle = angle;
        this.angleSpeed = angleSpeed;
    }

    /**
     *
     * @returns {Vector}
     */
    getVelocity() {
        return new Vector(
            this.speed * Math.sin(this.angle),
            -1 * this.speed * Math.cos(this.angle)
        );
    }

    /**
     *
     * @param {Number} delta
     */
    update(delta = 1) {
        this.trajectory.push(this.position);
        this.trajectory = [...this.trajectory.slice(-this.trajectory_limit), this.position];

        this.angle += this.angleSpeed * delta;
        const velocity = this.getVelocity();
        this.position = this.position.add(velocity.multiplyScalar(delta));
    }
}