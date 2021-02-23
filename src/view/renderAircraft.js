/**
 *
 * @param ctx
 * @param {Aircraft} aircraft
 * @param {String} color
 * @param texture
 */

export const renderAircraft = (ctx, aircraft, color = '#f0f0f0', texture) => {
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    aircraft.trajectory.forEach((position) => {
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
};

/**
 *
 * @param ctx
 * @param {AircraftGuided} aircraft
 * @param {String} color
 */
export const renderAircraftGuided = (ctx, aircraft, color = '#f0f0f0', texture) => {
    aircraft.sightLines.forEach(({line, from, to}, i, {length}) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle= `rgba(168,215,102,${i/length+0.5})`;
        ctx.beginPath();
        ctx.moveTo(...from.coords());
        ctx.lineTo(...to.coords());
        ctx.stroke();
    });
    renderAircraft(ctx, aircraft, color, texture);
}