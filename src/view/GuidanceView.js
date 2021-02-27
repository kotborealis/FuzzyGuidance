import {svgGrid} from './svgGrid';
import {renderAircraft, renderAircraftGuided} from './renderAircraft';
import {ChartAngle} from './ChartAngle';
import {airplaneEnemy, airplaneFriend} from './airplaneGraphics';
import {renderExplosion} from './renderExplosion';
import {Chart} from './Chart';

const width = 500;
const height = 500;

export const renderGuidanceValues = (
    chartV,
    valueVInt,
    valueVFloat,
    chartD,
    valueDInt,
    valueDFloat,
    chartOmega,
    valueOmegaInt,
    valueOmegaFloat,
    chartAlpha,
    valueAlphaInt,
    valueAlphaFloat,
    world
) => {
    if(
        [chartV,
            valueVInt,
            valueVFloat,
            chartD,
            valueDInt,
            valueDFloat,
            chartOmega,
            valueOmegaInt,
            valueOmegaFloat,
            chartAlpha,
            valueAlphaInt,
            valueAlphaFloat].map(e => e.current).every(e => e !== null)
        &&
        world.uav
    ){
        valueVInt.current.innerHTML = '+' + world.uav.params.v.toFixed(5).split('.')[0];
        valueVFloat.current.innerHTML = world.uav.params.v.toFixed(5).split('.')[1];
        valueDInt.current.innerHTML = '+' + world.uav.params.d.toFixed(5).split('.')[0];
        valueDFloat.current.innerHTML = world.uav.params.d.toFixed(5).split('.')[1];
        valueOmegaInt.current.innerHTML = world.uav.params.omega.toFixed(5).split('.')[0].padStart(2, '+');
        valueOmegaFloat.current.innerHTML = world.uav.params.omega.toFixed(5).split('.')[1];
        valueAlphaInt.current.innerHTML = world.uav.params.alpha.toFixed(5).split('.')[0].padStart(2, '+');
        valueAlphaFloat.current.innerHTML = world.uav.params.alpha.toFixed(5).split('.')[1];

        ChartAngle(chartAlpha.current, world.uav.trace.angle_speed);
        ChartAngle(chartOmega.current, world.uav.trace.sightline_angle);
        Chart(chartD.current, world.uav.trace.distance);
        Chart(chartV.current, world.uav.trace.approach_velocity);
    }

    setTimeout(() => renderGuidanceValues(
        chartV,
        valueVInt,
        valueVFloat,
        chartD,
        valueDInt,
        valueDFloat,
        chartOmega,
        valueOmegaInt,
        valueOmegaFloat,
        chartAlpha,
        valueAlphaInt,
        valueAlphaFloat,
        world), 200);
};

export const renderGuidanceView = (canvasRef, world) => {
    const canvas = canvasRef.current;
    if(canvas){
        canvas.width = width;
        canvas.height = height;

        const {uav, enemy} = world;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(svgGrid.current)
            ctx.drawImage(svgGrid.current, 0, 0);

        renderAircraftGuided(ctx, uav, "#2d2dfc", airplaneFriend);

        renderAircraft(ctx, enemy, "#b80c48", airplaneEnemy);

        if(world.simulation.endedAt)
            renderExplosion(ctx, enemy);

    }

    requestAnimationFrame(() => renderGuidanceView(canvasRef, world));
};