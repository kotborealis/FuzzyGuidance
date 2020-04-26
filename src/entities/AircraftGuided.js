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
    }

    updateSightLines(){
        const {sightLines} = this;
        const sightLine = new SightLine(this.position, this.target.position);
        this.sightLines = [...this.sightLines.slice(-100), sightLine];
    }

    getGuidanceVars(delta){
        const {sightLines} = this;
        if(sightLines.length > 1){
            const sightLine = sightLines[sightLines.length - 1];
            const d = sightLine.distance();

            const sightLinePrev = sightLines[sightLines.length - 2];
            const v = Math.abs(sightLinePrev.distance() - d) / delta;

            const omega = (sightLine.angle() - sightLinePrev.angle())  / delta;

            return {d, v, omega};
        }
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const guidanceVars = this.getGuidanceVars(delta);
        if(!guidanceVars) return;

        const {d, v, omega} = guidanceVars;
        const alpha = v * omega / d;
        this.angleSpeed = clamp(-Math.PI * 2, Math.PI * 2, 1/delta * 100*alpha);
    }
}