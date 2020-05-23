import {svgGrid} from './svgGrid';
import {renderAircraft, renderAircraftGuided} from './renderAircraft';
import {Vector} from '../vector/Vector';
import {ChartAngle} from './ChartAngle';
import {airplaneEnemy, airplaneFriend} from './airplaneGraphics';
import {renderExplosion} from './renderExplosion';
import {Chart} from './Chart';

const width = 500;
const height = 500;

export const renderGuidanceValues = (selector, world) => {
    const chartData = {
        chart_alpha: ChartAngle(selector + ' table canvas.chart-value-alpha'),
        chart_omega: ChartAngle(selector + ' table canvas.chart-value-omega'),
        chart_d: Chart(selector + ' table canvas.chart-value-d'),
        chart_v: Chart(selector + ' table canvas.chart-value-v'),
        omega_history: [],
        d_history: [],
        v_history: []
    }
    renderGuidanceValuesHelper(selector, world, chartData);
}

const renderGuidanceValuesHelper = (selector, world, chartData) => {
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

        chartData.chart_alpha(world.uav.angle_speed_history);

        chartData.omega_history = [...chartData.omega_history.slice(-100), world.uav.params.omega];
        chartData.chart_omega(chartData.omega_history);

        chartData.d_history = [...chartData.d_history.slice(-100), world.uav.params.d];
        chartData.chart_d(chartData.d_history);

        chartData.v_history = [...chartData.v_history.slice(-100), world.uav.params.v];
        chartData.chart_v(chartData.v_history);
    }

    setTimeout(() => renderGuidanceValuesHelper(selector, world, chartData), 1000/60);
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

    if(svgGrid.current)
        ctx.drawImage(svgGrid.current, 0, 0);

    renderAircraftGuided(ctx, uav, "#2d2dfc", airplaneFriend);

    renderAircraft(ctx, enemy, "#b80c48", airplaneEnemy);

    if(world.simulation.endedAt)
        renderExplosion(ctx, enemy);

    requestAnimationFrame(() => renderGuidanceViewHelper(canvas, world));
};