export class World {
    simulation = {
        startedAt: null,
        endedAt: null,
    };

    /** @type {AircraftGuided|AircraftFuzzyGuided} **/
    uav;

    /** @type {Aircraft} **/
    enemy;

    constructor({enemy, uav}) {
        this.enemy = enemy;
        this.uav = uav;
        this.simulation.startedAt = Date.now();
        this.simulation.endedAt = null;
    }

    updateSimulation(delta) {
        if(this.simulation.endedAt) return;

        const {uav, enemy} = this;

        uav.updateGuidance(delta);
        uav.update(delta);
        enemy.update(delta);

        if(uav.position.distance(enemy.position) < 20)
            this.simulation.endedAt = Date.now();

        requestAnimationFrame(() => this.updateSimulation(delta));
    }
}