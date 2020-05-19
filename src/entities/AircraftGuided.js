import {Aircraft} from './Aircraft';
import {Vector} from '../vector/Vector';
import {clamp} from '../utils';

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

    /** @type {Aircraft} **/
    target;

    /** @type {SightLine[]} **/
    sightLines = [];

    /** @type {Number[]} **/
    angle_speed_history = [];

    /** @type {Number} **/
    angle_speed_limit = 100;

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
        this.updateSightLines();
    }

    updateSightLines(){
        const sightLine = new SightLine(this.position, this.target.position);
        this.sightLines = [...this.sightLines.slice(-50), sightLine];
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
        const alpha = clamp(-Math.PI * 2, Math.PI * 2, (omega * d) / v);
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.angle_speed_history = [...this.angle_speed_history.slice(-this.angle_speed_limit), alpha];
    }
}