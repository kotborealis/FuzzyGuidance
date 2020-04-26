import {Aircraft} from './entities/Aircraft';
import {Vector} from './vector/Vector';
import {AircraftGuided} from './entities/AircraftGuided';
import {renderGuidanceView} from './view/GuidanceView';
import {AircraftFuzzyGuided} from './entities/AircraftFuzzyGuided';

const world = {};

const generateWorld = (world) => {
    world.enemy = new Aircraft(Vector.random(0, 500, 0, 500), Math.random()*20+10, Math.random()*90-90);
    world.uav = new AircraftFuzzyGuided(world.enemy.position.sub(Vector.random(-200, 200, -200, 200)), Math.random()*20+30, world.enemy);
}

generateWorld(world);

const update = (world, delta = 1) => {
    world.uav.update(delta);
    world.enemy.update(delta);

    if(world.uav.getGuidanceVars(1/10)){
        document.querySelector('.fuzzy-d').innerHTML =
            `d=${world.uav.crisp.d}<br/>` +
            world.uav.fuzzy.d.sets.map(set => `${set.name}=${set.fuzzyValue}`).join(' ');

        document.querySelector('.fuzzy-omega').innerHTML =
            `omega=${world.uav.crisp.omega}<br/>` +
            world.uav.fuzzy.omega.sets.map(set => `${set.name}=${set.fuzzyValue}`).join(' ')

        document.querySelector('.fuzzy-alpha').innerHTML =
            `alpha=${world.uav.getGuidanceVars(1).alpha}<br/>` +
            world.uav.fuzzy.alpha.sets.map(set => `${set.name}=${set.fuzzyValue}`).join(' ');
    }

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
updateGuidance(world, 1/10);

renderGuidanceView(world);
