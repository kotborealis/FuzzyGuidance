import {renderGuidanceValues, renderGuidanceView} from './view/GuidanceView';
import {Universe} from './model/entities/Universe';
import {renderFuzzySet} from './view/FuzzySet';
import {Vector} from './model/vector/Vector';

const state = {
    universe: null,
    params: {
        enemy: {
            pos: new Vector(300, 300),
            speed: 10,
            angle: 0,
            angleSpeed: -5 / 25,
        },
        uav: {
            pos: new Vector(500, 500),
            speed: 15,
        }
    }
};

window.state = state;

state.universe = new Universe({...state.params});

renderGuidanceView('.crisp-guidance-view', state.universe.worlds.crisp);
renderGuidanceView('.fuzzy-guidance-view', state.universe.worlds.fuzzy);

renderGuidanceValues('.crisp-guidance-view', state.universe.worlds.crisp);
renderGuidanceValues('.fuzzy-guidance-view', state.universe.worlds.fuzzy);

renderFuzzySet(".fuzzy-d", state.universe.worlds.fuzzy.uav.fuzzy.d);
renderFuzzySet(".fuzzy-v", state.universe.worlds.fuzzy.uav.fuzzy.v);
renderFuzzySet(".fuzzy-alpha", state.universe.worlds.fuzzy.uav.fuzzy.alpha, [-Math.PI * 2, Math.PI * 2]);
renderFuzzySet(".fuzzy-omega", state.universe.worlds.fuzzy.uav.fuzzy.omega, [-Math.PI * 2, Math.PI * 2]);

state.universe.start(1);