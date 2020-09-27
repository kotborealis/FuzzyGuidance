import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {Vector} from '../vector/Vector';
import {FuzzySetLIMFN, FuzzySetLIMFP, FuzzySetTRIMF, FuzzyVariable} from '../fuzzy/fuzzy';
import {FuzzyRule} from '../fuzzy/FuzzyRule';

const approachVelocity = new FuzzyVariable();
const distance = new FuzzyVariable();
const sightlineAngleVelocity = new FuzzyVariable();
const desiredAngleVelocity = new FuzzyVariable();

const v = approachVelocity;
v.set.Z = new FuzzySetLIMFN(0.1, 0.2);
v.set.S = new FuzzySetTRIMF(0.1, 0.4, 0.7);
v.set.L = new FuzzySetLIMFP(0.6, 0.9);

const d = distance;
d.set.Z = new FuzzySetLIMFN(0.1, 0.2);
d.set.S = new FuzzySetTRIMF(0.1, 0.4, 0.7);
d.set.L = new FuzzySetLIMFP(0.6, 0.9);

const omega = sightlineAngleVelocity;
omega.set.LN = new FuzzySetLIMFN(-2 * Math.PI, -0.1 * Math.PI);
omega.set.N = new FuzzySetTRIMF(-1.75 * Math.PI, -0.5 * Math.PI, 0);
omega.set.Z = new FuzzySetTRIMF(-0.5 * Math.PI, 0, 0.5 * Math.PI);
omega.set.P = new FuzzySetTRIMF(0, 0.5 * Math.PI, 1.75 * Math.PI);
omega.set.LP = new FuzzySetLIMFP(0.1 * Math.PI, 2 * Math.PI);

const alpha = desiredAngleVelocity;
alpha.set.LN = new FuzzySetLIMFN(-2 * Math.PI, -0.9 * Math.PI);
alpha.set.N = new FuzzySetTRIMF(-Math.PI, -0.9 * Math.PI, 0);
alpha.set.Z = new FuzzySetTRIMF(-0.9 * Math.PI, 0, 0.9 * Math.PI);
alpha.set.P = new FuzzySetTRIMF(0, 0.9 * Math.PI, Math.PI);
alpha.set.LP = new FuzzySetLIMFP(0.9 * Math.PI, 2 * Math.PI);

alpha.rule.LN = new FuzzyRule;
alpha.rule.LN.add(d.set.S, omega.set.N);
alpha.rule.LN.add(d.set.S, omega.set.LN);
alpha.rule.LN.add(d.set.L, omega.set.LN);
alpha.rule.LN.add(omega.set.LP, v.set.L);
alpha.rule.LN.add(omega.set.LP, v.set.S);

alpha.rule.N = new FuzzyRule;
alpha.rule.N.add(d.set.L, omega.set.N);
alpha.rule.N.add(omega.set.N, v.set.S);

alpha.rule.Z = new FuzzyRule;
alpha.rule.Z.add(d.set.Z, omega.set.LN);
alpha.rule.Z.add(d.set.Z, omega.set.N);
alpha.rule.Z.add(d.set.Z, omega.set.Z);
alpha.rule.Z.add(d.set.Z, omega.set.P);
alpha.rule.Z.add(d.set.Z, omega.set.LP);
alpha.rule.Z.add(d.set.Z, omega.set.Z);
alpha.rule.Z.add(d.set.S, omega.set.Z);
alpha.rule.Z.add(d.set.L, omega.set.Z);

alpha.rule.P = new FuzzyRule;
alpha.rule.P.add(d.set.L, omega.set.P);
alpha.rule.P.add(omega.set.P, v.set.S);

alpha.rule.LP = new FuzzyRule;
alpha.rule.LP.add(d.set.S, omega.set.P);
alpha.rule.LP.add(d.set.S, omega.set.LP);
alpha.rule.LP.add(d.set.L, omega.set.LP);
alpha.rule.LP.add(omega.set.LP, v.set.L);
alpha.rule.LP.add(omega.set.LP, v.set.S);

export class AircraftFuzzyGuided extends AircraftGuided {
    fuzzy = {
        d: null,
        alpha: null,
        omega: null
    };

    /**
     *
     * @param {Vector} position
     * @param {Number} speed
     * @param {Aircraft} target
     */
    constructor(position = Vector.zero(), speed = 0, target) {
        super(position, speed, target);

        this.fuzzy.alpha = alpha;
        this.fuzzy.omega = omega;
        this.fuzzy.d = d;
        this.fuzzy.v = v;
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const {d, v, omega} = this.getGuidanceVars(delta);
        this.fuzzy.v.fuzzyfy(v / Math.max(...this.trace.approach_velocity));
        this.fuzzy.d.fuzzyfy(d);
        this.fuzzy.omega.fuzzyfy(omega);
        const alpha = this.fuzzy.alpha.defuzzify();
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.trace.angle_speed.push(isNaN(alpha) ? 0 : alpha);
        this.trace.approach_velocity.push(v);
        this.trace.distance.push(d);
    }
}