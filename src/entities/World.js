export class World {
    simulation = {
        startedAt: null,
        endedAt: null,
    };

    /** @type {null|AircraftGuided|AircraftFuzzyGuided} **/
    uav = null;

    /** @type {null|Aircraft} **/
    enemy = null;

    _uav_start = null;
    _enemy_start = null;

    resetSimulation(){
        this.simulation.startedAt = Date.now();
        this.simulation.endedAt = null;
        this._uav_start = null;
        this._enemy_start = null;
    }

    update(delta = 1){
        const {uav, enemy} = this;

        if(this._uav_start === null) this._uav_start = {...uav};
        if(this._enemy_start === null) this._enemy_start = {...enemy};

        uav.update(delta);
        enemy.update(delta);

        if(uav.position.distance(enemy.position) < 20) {
            this.simulation.endedAt = Date.now();
        }
    }
}