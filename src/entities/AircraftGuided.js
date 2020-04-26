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

    updateGuidance(delta) {
        const {sightLines} = this;

        const sightLine = new SightLine(this.position, this.target.position);
        const d = sightLine.distance();

        if(sightLines.length > 0){
            const sightLinePrev = sightLines[sightLines.length - 1];
            const v = Math.abs(sightLinePrev.distance() - d);

            const omega = (sightLine.angle() - sightLinePrev.angle());
            const alpha = v * omega / d;

            this.angleSpeed = 100*clamp(-Math.PI, Math.PI, alpha);
        }

        this.sightLines = [...this.sightLines.slice(-100), sightLine];
    }
}