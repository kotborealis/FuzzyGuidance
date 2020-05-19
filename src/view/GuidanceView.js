import {svgGrid} from './svgGrid';
import {renderAircraft, renderAircraftGuided} from './renderAircraft';
import {Vector} from '../vector/Vector';
import {Chart} from './Chart';
import {airplaneEnemy, airplaneFriend} from './airplaneGraphics';
import {renderExplosion} from './renderExplosion';

const width = 500;
const height = 500;

export const renderGuidanceValues = (selector, world) => {
    const chart_alpha = Chart(selector + ' table canvas.chart-value-alpha')
    renderGuidanceValuesHelper(selector, world, chart_alpha);
}

const renderGuidanceValuesHelper = (selector, world, chart_alpha) => {
    const table = document.querySelector(selector + '>table');
    if(world.uav){
        table.querySelector('.guidance-value-v-integer')
            .innerHTML = '+' + world.uav.params.v.toFixed(5).split('.')[0];
        table.querySelector('.guidance-value-v-floating')
            .innerHTML = world.uav.params.v.toFixed(5).split('.')[1];
        table.querySelector('.guidance-value-d-integer')
            .innerHTML = '+' + world.uav.params.d.toFixed(5).split('.')[0];
        table.querySelector('.guidance-value-d-floating')
            .innerHTML = world.uav.params.d.toFixed(5).split('.')[1];
        table.querySelector('.guidance-value-omega-integer')
            .innerHTML = world.uav.params.omega.toFixed(5).split('.')[0].padStart(2, '+');
        table.querySelector('.guidance-value-omega-floating')
            .innerHTML = world.uav.params.omega.toFixed(5).split('.')[1];
        table.querySelector('.guidance-value-alpha-integer')
            .innerHTML = world.uav.params.alpha.toFixed(5).split('.')[0].padStart(2, '+');
        table.querySelector('.guidance-value-alpha-floating')
            .innerHTML = world.uav.params.alpha.toFixed(5).split('.')[1];

        chart_alpha(world.uav.angle_speed_history);
    }

    setTimeout(() => renderGuidanceValuesHelper(selector, world, chart_alpha), 1/120);
};

export const renderGuidanceView = (selector, world) => {
    const canvas = document.querySelector(selector + '>canvas.world-view');
    canvas.width = width;
    canvas.height = height;

    renderGuidanceViewHelper(canvas, world);
};

const renderGuidanceViewHelper = (canvas, world) => {
    const {uav, enemy} = world;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(svgGrid, 0, 0);

    renderAircraftGuided(ctx, uav, "#2d2dfc", airplaneFriend);

    renderAircraft(ctx, enemy, "#b80c48", airplaneEnemy);

    if(world.simulation.endedAt)
        renderExplosion(ctx, enemy);

    requestAnimationFrame(() => renderGuidanceViewHelper(canvas, world));
};