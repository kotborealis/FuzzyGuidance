import {Aircraft} from './entities/Aircraft';
import {Vector} from './vector/Vector';
import {AircraftGuided} from './entities/AircraftGuided';
import {renderGuidanceView} from './view/GuidanceView';
import {AircraftFuzzyGuided} from './entities/AircraftFuzzyGuided';

const world = {
    uav: null,
    enemy: null,
    endSimulation: false,
};
const worldFuzzy = {
    uav: null,
    enemy: null,
    endSimulation: false,
};

const generateWorlds = (world, worldFuzzy) => {
    const enemy_pos = Vector.random(0, 500, 0, 500);
    const enemy_speed = Math.random()*20+10;
    const enemy_angle = Math.random()*200-100;
    const enemy_angleSpeed = Math.random()*2-1;

    world.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);
    worldFuzzy.enemy = new Aircraft(enemy_pos, enemy_speed, enemy_angle, enemy_angleSpeed);

    const uav_pos = Vector.random(0, 500, 0, 500);
    const uav_speed = Math.random()*20+30;

    world.uav = new AircraftGuided(uav_pos, uav_speed, world.enemy);
    worldFuzzy.uav = new AircraftFuzzyGuided(uav_pos, uav_speed, worldFuzzy.enemy);
}

const handleSimEnd = () => {
    if(worldFuzzy.endSimulation && world.endSimulation){
        world.endSimulation = false;
        worldFuzzy.endSimulation = false;
        generateWorlds(world, worldFuzzy);
    }
}

generateWorlds(world, worldFuzzy);

const update = (world, delta = 1) => {
    world.uav.update(delta);
    world.enemy.update(delta);

    if(world.uav.position.distance(world.enemy.position) < 20) {
        world.endSimulation = true;
        handleSimEnd();
    }

    setTimeout(() => update(world, delta), delta * 1000);
}

update(world, 1/60);
update(worldFuzzy, 1/60);

const updateGuidance = (world, delta) => {
    world.uav.updateGuidance(delta);
    setTimeout(() => updateGuidance(world, delta), delta * 1000);
}
updateGuidance(world, 1/50);
updateGuidance(worldFuzzy, 1/50);

renderGuidanceView('canvas.guidance-view', world);
renderGuidanceView('canvas.fuzzy-guidance-view', worldFuzzy);
