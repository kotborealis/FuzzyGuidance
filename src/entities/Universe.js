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

    generate() {
        const {crisp, fuzzy} = this.worlds;

        const enemy_pos = Vector.random(0, 500, 0, 500);
        const enemy_speed = Math.random() * 20 + 10;
        const enemy_angle = Math.random() * 200 - 100;
        const enemy_angleSpeed = Math.random() * 2 - 1;

        const uav_pos = Vector.random(0, 500, 0, 500);
        const uav_speed = Math.random() * 20 + 30;

        crisp.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);
        fuzzy.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);

        crisp.uav = new AircraftGuided(uav_pos, uav_speed, crisp.enemy);
        fuzzy.uav = new AircraftFuzzyGuided(uav_pos, uav_speed, fuzzy.enemy);
    }

    updateSimulation(delta = 1) {
        const {crisp, fuzzy} = this.worlds;

        if(!crisp.simulation.endedAt)
            crisp.update(delta);

        if(!fuzzy.simulation.endedAt)
            fuzzy.update(delta);

        if(fuzzy.simulation.endedAt && crisp.simulation.endedAt){
            this.generate();
            fuzzy.resetSimulation();
            crisp.resetSimulation();
        }

        setTimeout(() => this.updateSimulation(delta), delta * 1000);
    }

    updateGuidance(delta) {
        const {crisp, fuzzy} = this.worlds;

        if(!crisp.simulation.endedAt)
            this.worlds.crisp.uav.updateGuidance(delta);
        if(!fuzzy.simulation.endedAt)
            this.worlds.fuzzy.uav.updateGuidance(delta);

        setTimeout(() => this.updateGuidance(delta), delta * 1000);
    }
}