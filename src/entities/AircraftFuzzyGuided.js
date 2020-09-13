import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {Vector} from '../vector/Vector';
import {clamp} from '../utils';
import {FuzzyVariable, FuzzySetTRIMF} from '../fuzzy/fuzzy';
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
        v.set.Z = new FuzzySetTRIMF(0, 10, 15);
        v.set.S = new FuzzySetTRIMF(10, 15, 20);
        v.set.L = new FuzzySetTRIMF(20, 30, Number.POSITIVE_INFINITY);

        const d = distance;
        d.set.Z = new FuzzySetTRIMF(0, 25, 50);
        d.set.S = new FuzzySetTRIMF(25, 250, 1000);
        d.set.L = new FuzzySetTRIMF(950, 5000, Number.POSITIVE_INFINITY);

        const omega = sightlineAngleVelocity;
        omega.set.LN = new FuzzySetTRIMF(Number.NEGATIVE_INFINITY, -1.75*Math.PI, -0.1 * Math.PI);
        omega.set.N = new FuzzySetTRIMF(-1.75*Math.PI, -0.5 * Math.PI, 0);
        omega.set.Z = new FuzzySetTRIMF(-0.5*Math.PI, 0, 0.5*Math.PI);
        omega.set.P = new FuzzySetTRIMF(0, 0.5 * Math.PI, 1.75*Math.PI);
        omega.set.LP = new FuzzySetTRIMF(0.1 * Math.PI, -1.75*Math.PI, Number.POSITIVE_INFINITY);

        const alpha = desiredAngleVelocity;
        alpha.set.LN = new FuzzySetTRIMF(-Math.PI*2, -Math.PI, -0.9*Math.PI);
        alpha.set.N = new FuzzySetTRIMF(-Math.PI, -0.9*Math.PI, 0);
        alpha.set.Z = new FuzzySetTRIMF(-0.9*Math.PI, 0, 0.9*Math.PI);
        alpha.set.P = new FuzzySetTRIMF(0, 0.9*Math.PI, Math.PI);
        alpha.set.LP = new FuzzySetTRIMF(0.9*Math.PI, Math.PI, Math.PI*2);

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

        this.fuzzy.alpha = alpha;
        this.fuzzy.omega = omega;
        this.fuzzy.d = d;
        this.fuzzy.v = v;
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const {d, v, omega} = this.getGuidanceVars(delta);
        this.fuzzy.v.fuzzyfy(v);
        this.fuzzy.d.fuzzyfy(d);
        this.fuzzy.omega.fuzzyfy(omega);
        const alpha = clamp(-Math.PI * 2, Math.PI * 2, this.fuzzy.alpha.defuzzify());
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.angle_speed_history = [...this.angle_speed_history.slice(-this.angle_speed_limit), alpha];
    }
}