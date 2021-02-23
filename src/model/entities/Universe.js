import {World} from './World';
import {Vector} from '../vector/Vector';
import {Aircraft} from './Aircraft';
import {AircraftGuided} from './AircraftGuided';
import {AircraftFuzzyGuided} from './AircraftFuzzyGuided';

export class Universe {
    /** @type {{fuzzy: World|null, crisp: World|null}} **/
    worlds = {
        fuzzy: null,
        crisp: null
    };

    /**
     *
     * @param {{pos: Vector, speed: Number}} uav
     * @param {{pos: Vector, speed: Number, angle: Number, angleSpeed: Number}} enemy
     */
    constructor({enemy, uav}) {
        const crisp_enemy = new Aircraft(enemy.pos, enemy.speed, enemy.angle, enemy.angleSpeed);
        const crisp_uav = new AircraftGuided(uav.pos, uav.speed, crisp_enemy);
        this.worlds.crisp = new World({enemy: crisp_enemy, uav: crisp_uav});

        const fuzzy_enemy = new Aircraft(enemy.pos, enemy.speed, enemy.angle, enemy.angleSpeed);
        const fuzzy_uav = new AircraftFuzzyGuided(uav.pos, uav.speed, fuzzy_enemy);
        this.worlds.fuzzy = new World({enemy: fuzzy_enemy, uav: fuzzy_uav});
    }

    start(delta) {
        this.worlds.crisp.updateSimulation(delta);
        this.worlds.fuzzy.updateSimulation(delta);
    }
}