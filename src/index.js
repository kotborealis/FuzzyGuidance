import {renderGuidanceView} from './view/GuidanceView';
import {Universe} from './entities/Universe';

const universe = new Universe();

universe.generate();
universe.updateSimulation(1 / 60);
universe.updateGuidance(1/60);


renderGuidanceView('canvas.crisp-guidance-view', universe.worlds.crisp);
renderGuidanceView('canvas.fuzzy-guidance-view', universe.worlds.fuzzy);
