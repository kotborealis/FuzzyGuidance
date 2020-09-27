import {World} from './World';
import {Vector} from '../vector/Vector';
import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {AircraftFuzzyGuided} from './AircraftFuzzyGuided';

export class Universe {
    /** @type {*} **/
    worlds = {
        fuzzy: new World,
        crisp: new World
    };

    params = {};


    generate() {
        this.params.enemy_pos = Vector.random(200, 300, 200, 300);
        this.params.enemy_speed = Math.random() * 20 + 10;
        this.params.enemy_angle = Math.random() * 200 - 100;
        this.params.enemy_angleSpeed = 0.5;

        this.params.uav_pos = this.params.enemy_pos.add(Vector.random(-200, 200, 200, 200));
        this.params.uav_speed = Math.random() * 20 + 30;
    }

    updateSimulation(delta = 1) {
        const {crisp, fuzzy} = this.worlds;

        if(!crisp.simulation.endedAt)
            crisp.update(delta);

        if(!fuzzy.simulation.endedAt)
            fuzzy.update(delta);

        requestAnimationFrame(() => this.updateSimulation(delta));
    }

    reset() {
        const {crisp, fuzzy} = this.worlds;

        const {enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed, uav_pos, uav_speed} = this.params;

        crisp.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);
        fuzzy.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);

        crisp.uav = new AircraftGuided(uav_pos, uav_speed, crisp.enemy);
        fuzzy.uav = new AircraftFuzzyGuided(uav_pos, uav_speed, fuzzy.enemy);

        fuzzy.resetSimulation();
        crisp.resetSimulation();
    }

    updateGuidance(delta) {
        const {crisp, fuzzy} = this.worlds;

        if(!crisp.simulation.endedAt)
            this.worlds.crisp.uav.updateGuidance(delta);
        if(!fuzzy.simulation.endedAt)
            this.worlds.fuzzy.uav.updateGuidance(delta);

        requestAnimationFrame(() => this.updateGuidance(delta));
    }
}