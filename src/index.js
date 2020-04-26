import {Aircraft} from './entities/Aircraft';
import {Vector} from './vector/Vector';
import {AircraftGuided} from './entities/AircraftGuided';
import {renderGuidanceView} from './view/GuidanceView';

const world = {};

const generateWorld = (world) => {
    world.enemy = new Aircraft(Vector.random(0, 500, 0, 500), Math.random()*20+10, Math.random()*90-90);
    world.uav = new AircraftGuided(Vector.random(0, 500, 0, 500), Math.random()*20+30, world.enemy);
}

generateWorld(world);

const update = (world, delta = 1) => {
    world.uav.update(delta);
    world.enemy.update(delta);

    if(world.uav.position.distance(world.enemy.position) < 20) {
        generateWorld(world);
    }

    setTimeout(() => update(world, delta), delta * 1000);
}

update(world, 1/60);

const updateGuidance = (world, delta) => {
    world.uav.updateGuidance(delta);
    setTimeout(() => updateGuidance(world, delta), delta * 1000);
}
updateGuidance(world, 1/2);

renderGuidanceView(world);
