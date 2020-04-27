export class World {
    simulation = {
        startedAt: null,
        endedAt: null,
    };

    /** @type {null|AircraftGuided|AircraftFuzzyGuided} **/
    uav = null;

    /** @type {null|Aircraft} **/
    enemy = null;

    resetSimulation(){
        this.simulation.startedAt = Date.now();
        this.simulation.endedAt = null;
    }

    update(delta = 1){
        const {uav, enemy} = this;

        uav.update(delta);
        enemy.update(delta);

        if(uav.position.distance(enemy.position) < 20) {
            this.simulation.endedAt = Date.now();
        }
    }
}