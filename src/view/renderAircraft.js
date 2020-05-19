/**
 *
 * @param ctx
 * @param {Aircraft} aircraft
 * @param {String} color
 * @param texture
 */
import {Vector} from '../vector/Vector';

export const renderAircraft = (ctx, aircraft, color = '#f0f0f0', texture) => {
    aircraft.trajectory.forEach((position, i, {length}) => {
        if(i % 2 === 0) return;
        ctx.fillStyle = color + Math.floor(0xff * i/length).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(...position.coords(), 1, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    ctx.save();
    ctx.translate(...aircraft.position.coords());
    ctx.rotate(aircraft.angle);
    if(texture.current)
        ctx.drawImage(texture.current, -20, -20, 40, 40);
    ctx.restore();
}

/**
 *
 * @param ctx
 * @param {AircraftGuided} aircraft
 * @param {String} color
 */
export const renderAircraftGuided = (ctx, aircraft, color = '#f0f0f0', texture) => {
    aircraft.sightLines.forEach(({line, from, to}, i, {length}) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle= `rgba(168,215,102,${i/length})`;
        ctx.beginPath();
        ctx.moveTo(...from.coords());
        ctx.lineTo(...to.coords());
        ctx.stroke();
    });
    renderAircraft(ctx, aircraft, color, texture);
}