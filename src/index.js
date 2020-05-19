import {renderGuidanceValues, renderGuidanceView} from './view/GuidanceView';
import {Universe} from './entities/Universe';

const universe = new Universe();

universe.generate();
universe.updateSimulation(1/60);
universe.updateGuidance(1/60);

renderGuidanceView('.crisp-guidance-view', universe.worlds.crisp);
renderGuidanceView('.fuzzy-guidance-view', universe.worlds.fuzzy);

renderGuidanceValues('.crisp-guidance-view', universe.worlds.crisp);
renderGuidanceValues('.fuzzy-guidance-view', universe.worlds.fuzzy);
