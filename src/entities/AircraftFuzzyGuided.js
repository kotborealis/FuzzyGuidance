import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {Vector} from '../vector/Vector';
import {clamp} from '../utils';
import {FuzzyVariable, FuzzySetTRIMF} from '../fuzzy/fuzzy';

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
        super(position, speed, 0);
        this.target = target;

        const distance = new FuzzyVariable();
        const sightlineAngleVelocity = new FuzzyVariable();
        const desiredAngleVelocity = new FuzzyVariable();

        const d = distance;
        d.addSet("Z", new FuzzySetTRIMF(0, 25, 50));
        d.addSet("S", new FuzzySetTRIMF(25, 250, 500));
        d.addSet("L", new FuzzySetTRIMF(400, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER));

        const omega = sightlineAngleVelocity;
        omega.addSet("LN", new FuzzySetTRIMF(-Math.PI, -0.5, -0.25));
        omega.addSet("N", new FuzzySetTRIMF(-0.3, -0.01, 0));
        omega.addSet("Z", new FuzzySetTRIMF(-0.05, 0, 0.05));
        omega.addSet("P", new FuzzySetTRIMF(0, 0.01, 0.3));
        omega.addSet("LP", new FuzzySetTRIMF(-0.25, 0.5, Math.PI));

        const alpha = desiredAngleVelocity;
        alpha.addSet("LN", new FuzzySetTRIMF(-Math.PI, -0.5, -0.25));
        alpha.addSet("N", new FuzzySetTRIMF(-0.3, -0.01, 0));
        alpha.addSet("Z", new FuzzySetTRIMF(-0.01, 0, 0.01));
        alpha.addSet("P", new FuzzySetTRIMF(0, 0.01, 0.3));
        alpha.addSet("LP", new FuzzySetTRIMF(-0.25, 0.5, Math.PI));

        alpha.ruleFor("LN").add(d.set("S"), omega.set("P"));
        alpha.ruleFor("LN").add(d.set("S"), omega.set("LP"));
        alpha.ruleFor("LN").add(d.set("L"), omega.set("LP"));

        alpha.ruleFor("N").add(d.set("L"), omega.set("P"));

        alpha.ruleFor("Z").add(d.set("Z"), omega.set("LN"));
        alpha.ruleFor("Z").add(d.set("Z"), omega.set("N"));
        alpha.ruleFor("Z").add(d.set("Z"), omega.set("Z"));
        alpha.ruleFor("Z").add(d.set("Z"), omega.set("P"));
        alpha.ruleFor("Z").add(d.set("Z"), omega.set("LP"));
        alpha.ruleFor("Z").add(d.set("Z"), omega.set("Z"));
        alpha.ruleFor("Z").add(d.set("S"), omega.set("Z"));
        alpha.ruleFor("Z").add(d.set("L"), omega.set("Z"));

        alpha.ruleFor("P").add(d.set("L"), omega.set("N"));

        alpha.ruleFor("LP").add(d.set("S"), omega.set("N"));
        alpha.ruleFor("LP").add(d.set("S"), omega.set("LN"));
        alpha.ruleFor("LP").add(d.set("L"), omega.set("LN"));

        this.fuzzy.alpha = alpha;
        this.fuzzy.omega = omega;
        this.fuzzy.d = d;
    }

    updateGuidance(delta) {
        this.updateSightLines();
        const guidanceVars = this.getGuidanceVars(delta);
        if(!guidanceVars) return;

        const {d, v, omega} = guidanceVars;
        this.crisp = {d, v, omega};
        this.fuzzy.d.fuzzyfy(d);
        this.fuzzy.omega.fuzzyfy(omega);
        const alpha = this.fuzzy.alpha.defuzzify();

        this.angleSpeed = clamp(-Math.PI * 2, Math.PI * 2, -1/delta * 10*alpha);
    }
}