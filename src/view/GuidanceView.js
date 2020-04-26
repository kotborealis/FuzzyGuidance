import {svgGrid} from './svgGrid';
import {renderAircraft, renderAircraftGuided} from './renderAircraft';
import {Vector} from '../vector/Vector';

const canvas = document.querySelector('canvas.guidance-view');
window.canvas = canvas;

const width = 500;
const height = 500;

canvas.width = width;
canvas.height = height;

export const renderGuidanceView = (world) => {
    const {uav, enemy} = world;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(...uav.position.negate().add((new Vector(width, height)).multiplyScalar(0.5)).coords());

    ctx.drawImage(svgGrid, ...uav.position.coords());
    ctx.drawImage(svgGrid, ...uav.position.sub(new Vector(width, height)).coords());
    ctx.drawImage(svgGrid, ...uav.position.sub(new Vector(0, height)).coords());
    ctx.drawImage(svgGrid, ...uav.position.sub(new Vector(width, 0)).coords());

    renderAircraftGuided(ctx, uav, "#2d2dfc");

    renderAircraft(ctx, enemy, "#b80c48");

    ctx.restore();

    requestAnimationFrame(() => renderGuidanceView(world));
};
