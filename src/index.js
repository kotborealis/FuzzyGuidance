import {renderGuidanceValues, renderGuidanceView} from './view/GuidanceView';
import {Universe} from './entities/Universe';
import {renderFuzzySet} from './view/FuzzySet';

const universe = new Universe();

document.querySelector(".btn-new-universe").onclick = () => {
    universe.generate();
    universe.reset();
};

document.querySelector(".btn-restart").onclick = () => {
    universe.reset();
};

universe.generate();
universe.reset();
universe.updateSimulation(10 / 60);
universe.updateGuidance(10 / 60);

renderGuidanceView('.crisp-guidance-view', universe.worlds.crisp);
renderGuidanceView('.fuzzy-guidance-view', universe.worlds.fuzzy);

renderGuidanceValues('.crisp-guidance-view', universe.worlds.crisp);
renderGuidanceValues('.fuzzy-guidance-view', universe.worlds.fuzzy);

renderFuzzySet(".fuzzy-d", universe.worlds.fuzzy.uav.fuzzy.d);
renderFuzzySet(".fuzzy-v", universe.worlds.fuzzy.uav.fuzzy.v);
renderFuzzySet(".fuzzy-alpha", universe.worlds.fuzzy.uav.fuzzy.alpha, [-Math.PI * 2, Math.PI * 2]);
renderFuzzySet(".fuzzy-omega", universe.worlds.fuzzy.uav.fuzzy.omega, [-Math.PI * 2, Math.PI * 2]);