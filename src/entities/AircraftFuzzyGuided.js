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

    crisp = {
        d: null,
        v: null,
        omega: null
    }

    /**
     *
     * @param {Vector} position
     * @param {Number} speed
     * @param {Aircraft} target
     */
    constructor(position = Vector.zero(), speed = 0, target) {
        super(position, speed, target);

        const distance = new FuzzyVariable();
        const sightlineAngleVelocity = new FuzzyVariable();
        const desiredAngleVelocity = new FuzzyVariable();

        const d = distance;
        d.set.Z = new FuzzySetTRIMF(0, 25, 50);
        d.set.S = new FuzzySetTRIMF(25, 250, 500);
        d.set.L = new FuzzySetTRIMF(400, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER);

        const omega = sightlineAngleVelocity;
        omega.set.LN = new FuzzySetTRIMF(-Math.PI*2, -0.5, -0.25);
        omega.set.N = new FuzzySetTRIMF(-0.3, -0.1, 0);
        omega.set.Z = new FuzzySetTRIMF(-0.5, 0, 0.5);
        omega.set.P = new FuzzySetTRIMF(0, 0.1, 0.3);
        omega.set.LP = new FuzzySetTRIMF(-0.25, 0.5, Math.PI*2);

        const alpha = desiredAngleVelocity;
        alpha.set.LN = new FuzzySetTRIMF(-Math.PI, -0.5, -0.25);
        alpha.set.N = new FuzzySetTRIMF(-0.3, -0.25, 0);
        alpha.set.Z = new FuzzySetTRIMF(-0.25, 0, 0.25);
        alpha.set.P = new FuzzySetTRIMF(0, 0.25, 0.3);
        alpha.set.LP = new FuzzySetTRIMF(-0.25, 0.5, Math.PI);

        alpha.rule.LN = new FuzzyRule;
        alpha.rule.LN.add(d.set.S, omega.set.P);
        alpha.rule.LN.add(d.set.S, omega.set.LP);
        alpha.rule.LN.add(d.set.L, omega.set.LP);

        alpha.rule.N = new FuzzyRule;
        alpha.rule.N.add(d.set.L, omega.set.P);

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
        alpha.rule.P.add(d.set.L, omega.set.N);

        alpha.rule.LP = new FuzzyRule;
        alpha.rule.LP.add(d.set.S, omega.set.N);
        alpha.rule.LP.add(d.set.S, omega.set.LN);
        alpha.rule.LP.add(d.set.L, omega.set.LN);

        this.fuzzy.alpha = alpha;
        this.fuzzy.omega = omega;
        this.fuzzy.d = d;
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const {d, v, omega} = this.getGuidanceVars(delta);
        this.crisp = this.getGuidanceVars(delta);
        this.fuzzy.d.fuzzyfy(d);
        this.fuzzy.omega.fuzzyfy(omega);
        const alpha = this.fuzzy.alpha.defuzzify();
        this.angleSpeed = clamp(-Math.PI * 2, Math.PI * 2, -1/delta * 10*alpha);
    }
}