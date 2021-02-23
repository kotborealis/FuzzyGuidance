import {Aircraft} from './Aircraft';
import {Vector} from '../vector/Vector';

class SightLine {
    /** @type {Vector} **/
    line;
    /** @type {Vector} **/
    from;

    /**
     *
     * @param {Vector} from
     * @param {Vector} to
     */
    constructor(from, to) {
        this.line = to.sub(from);
        this.from = from;
        this.to = to;
    }

    /**
     *
     * @returns {Number}
     */
    distance(){
        return this.line.length();
    }

    angle(){
        return Math.atan2(this.line.y, this.line.x);
    }
}

export class AircraftGuided extends Aircraft {
    params = {
        d: 0,
        v: 0,
        omega: 0,
        alpha: 0,
    }

    trace = {
        angle_speed: [], // alpha
        approach_velocity: [], // v
        distance: [], // d,
        sightline_angle: [] // omega
    }

    /** @type {Aircraft} **/
    target;

    /** @type {SightLine[]} **/
    sightLines = [];

    /**
     *
     * @param {Vector} position
     * @param {Number} speed
     * @param {Aircraft} target
     */
    constructor(position = Vector.zero(), speed = 0, target) {
        super(position, speed, 0);
        this.target = target;
        this.updateSightLines();
    }

    updateSightLines(){
        const sightLine = new SightLine(this.position, this.target.position);
        this.sightLines.push(sightLine);
    }

    getGuidanceVars(delta){
        const {sightLines} = this;
        const sightLine = sightLines[sightLines.length - 1];
        const d = sightLine.distance();

        const sightLinePrev = sightLines[sightLines.length - 2];
        const v = Math.abs(sightLinePrev.distance() - d) / delta;
        const omega = (sightLine.angle() - sightLinePrev.angle()) / delta;

        return {d, v, omega};
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const {d, v, omega} = this.getGuidanceVars(delta);
        const alpha = v ? ((omega * d) / v) : 0;
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.trace.angle_speed.push(alpha);
        this.trace.approach_velocity.push(v);
        this.trace.distance.push(d);
        this.trace.sightline_angle.push(omega);
    }
}