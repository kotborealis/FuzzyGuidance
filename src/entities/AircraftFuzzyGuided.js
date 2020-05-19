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

        const distance = new FuzzyVariable();
        const sightlineAngleVelocity = new FuzzyVariable();
        const desiredAngleVelocity = new FuzzyVariable();

        const d = distance;
        d.set.Z = new FuzzySetTRIMF(0, 25, 50);
        d.set.S = new FuzzySetTRIMF(25, 250, 1000);
        d.set.L = new FuzzySetTRIMF(950, 5000, 10000);

        const omega = sightlineAngleVelocity;
        omega.set.LN = new FuzzySetTRIMF(-Math.PI*2, -Math.PI, -Math.PI/2);
        omega.set.N = new FuzzySetTRIMF(-Math.PI, -Math.PI/2, 0);
        omega.set.Z = new FuzzySetTRIMF(-Math.PI/2, 0, Math.PI/2);
        omega.set.P = new FuzzySetTRIMF(0, Math.PI/2, Math.PI);
        omega.set.LP = new FuzzySetTRIMF(Math.PI/2, Math.PI, Math.PI*2);

        const alpha = desiredAngleVelocity;
        alpha.set.LN = new FuzzySetTRIMF(-1, -0.5, -0.25);
        alpha.set.N = new FuzzySetTRIMF(-0.35, -0.35, 0);
        alpha.set.Z = new FuzzySetTRIMF(-0.35, 0, 0.35);
        alpha.set.P = new FuzzySetTRIMF(0, 0.35, 0.4);
        alpha.set.LP = new FuzzySetTRIMF(-0.25, 0.5, 1);

        alpha.rule.LN = new FuzzyRule;
        alpha.rule.LN.add(d.set.S, omega.set.N);
        alpha.rule.LN.add(d.set.S, omega.set.LN);
        alpha.rule.LN.add(d.set.L, omega.set.LN);

        alpha.rule.N = new FuzzyRule;
        alpha.rule.N.add(d.set.L, omega.set.N);

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

        alpha.rule.LP = new FuzzyRule;
        alpha.rule.LP.add(d.set.S, omega.set.P);
        alpha.rule.LP.add(d.set.S, omega.set.LP);
        alpha.rule.LP.add(d.set.L, omega.set.LP);

        this.fuzzy.alpha = alpha;
        this.fuzzy.omega = omega;
        this.fuzzy.d = d;
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const {d, v, omega} = this.getGuidanceVars(delta);
        this.fuzzy.d.fuzzyfy(d);
        this.fuzzy.omega.fuzzyfy(omega);
        const alpha = clamp(-Math.PI * 2, Math.PI * 2, this.fuzzy.alpha.defuzzify());
        this.angleSpeed = alpha;
        this.params = {d, v, omega, alpha};

        this.angle_speed_history = [...this.angle_speed_history.slice(-this.angle_speed_limit), alpha];
    }
}