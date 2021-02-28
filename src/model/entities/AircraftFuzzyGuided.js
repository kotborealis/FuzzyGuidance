import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {Vector} from '../vector/Vector';
import {FuzzySetLIMFN, FuzzySetLIMFP, FuzzySetTRIMF, FuzzyVariable} from '../fuzzy/fuzzy';
import {FuzzyRule} from '../fuzzy/FuzzyRule';

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

        const approachVelocity = new FuzzyVariable();
        const distance = new FuzzyVariable();
        const sightlineAngleVelocity = new FuzzyVariable();
        const desiredAngleVelocity = new FuzzyVariable();

        const v = approachVelocity;
        v.fset.Z = new FuzzySetLIMFN(0.1, 0.2);
        v.fset.S = new FuzzySetTRIMF(0.1, 0.4, 0.7);
        v.fset.L = new FuzzySetLIMFP(0.6, 0.9);

        const d = distance;
        d.fset.Z = new FuzzySetLIMFN(0.1, 0.2);
        d.fset.S = new FuzzySetTRIMF(0.1, 0.4, 0.7);
        d.fset.L = new FuzzySetLIMFP(0.6, 0.9);

        const omega = sightlineAngleVelocity;
        omega.fset.LN = new FuzzySetLIMFN(-2 * Math.PI, -0.1 * Math.PI);
        omega.fset.N = new FuzzySetTRIMF(-1.75 * Math.PI, -0.5 * Math.PI, 0);
        omega.fset.Z = new FuzzySetTRIMF(-0.5 * Math.PI, 0, 0.5 * Math.PI);
        omega.fset.P = new FuzzySetTRIMF(0, 0.5 * Math.PI, 1.75 * Math.PI);
        omega.fset.LP = new FuzzySetLIMFP(0.1 * Math.PI, 2 * Math.PI);

        const alpha = desiredAngleVelocity;
        alpha.fset.LN = new FuzzySetLIMFN(-2 * Math.PI, -0.9 * Math.PI);
        alpha.fset.N = new FuzzySetTRIMF(-Math.PI, -0.9 * Math.PI, 0);
        alpha.fset.Z = new FuzzySetTRIMF(-0.9 * Math.PI, 0, 0.9 * Math.PI);
        alpha.fset.P = new FuzzySetTRIMF(0, 0.9 * Math.PI, Math.PI);
        alpha.fset.LP = new FuzzySetLIMFP(0.9 * Math.PI, 2 * Math.PI);

        alpha.rule.LN = new FuzzyRule;
        alpha.rule.LN.add(d.fset.S, omega.fset.N);
        alpha.rule.LN.add(d.fset.S, omega.fset.LN);
        alpha.rule.LN.add(d.fset.L, omega.fset.LN);
        alpha.rule.LN.add(omega.fset.LP, v.fset.L);
        alpha.rule.LN.add(omega.fset.LP, v.fset.S);

        alpha.rule.N = new FuzzyRule;
        alpha.rule.N.add(d.fset.L, omega.fset.N);
        alpha.rule.N.add(omega.fset.N, v.fset.S);

        alpha.rule.Z = new FuzzyRule;
        alpha.rule.Z.add(d.fset.Z, omega.fset.LN);
        alpha.rule.Z.add(d.fset.Z, omega.fset.N);
        alpha.rule.Z.add(d.fset.Z, omega.fset.Z);
        alpha.rule.Z.add(d.fset.Z, omega.fset.P);
        alpha.rule.Z.add(d.fset.Z, omega.fset.LP);
        alpha.rule.Z.add(d.fset.Z, omega.fset.Z);
        alpha.rule.Z.add(d.fset.S, omega.fset.Z);
        alpha.rule.Z.add(d.fset.L, omega.fset.Z);

        alpha.rule.P = new FuzzyRule;
        alpha.rule.P.add(d.fset.L, omega.fset.P);
        alpha.rule.P.add(omega.fset.P, v.fset.S);

        alpha.rule.LP = new FuzzyRule;
        alpha.rule.LP.add(d.fset.S, omega.fset.P);
        alpha.rule.LP.add(d.fset.S, omega.fset.LP);
        alpha.rule.LP.add(d.fset.L, omega.fset.LP);
        alpha.rule.LP.add(omega.fset.LP, v.fset.L);
        alpha.rule.LP.add(omega.fset.LP, v.fset.S);

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
        let alpha = this.fuzzy.alpha.defuzzify();
        alpha = isNaN(alpha) ? 0 : alpha;
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.trace.size++;
        this.trace.angle_speed.push(alpha);
        this.trace.approach_velocity.push(v);
        this.trace.distance.push(d);
        this.trace.sightline_angle.push(omega);
    }
}