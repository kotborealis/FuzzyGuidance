/**
 *
 * @param ctx
 * @param {Aircraft} aircraft
 * @param {String} color
 */
export const renderAircraft = (ctx, aircraft, color = '#f0f0f0') => {
    aircraft.trajectory.forEach((position, i) => {
        if(i % 2 === 0) return;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(...position.coords(), 1, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeStyle= "#0f0f0f";
    ctx.beginPath();
    ctx.arc(...aircraft.position.coords(), 10, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle= "#9400ff";
    ctx.beginPath();
    ctx.moveTo(...aircraft.position.coords());
    ctx.lineTo(...aircraft.position.add(aircraft.getVelocity()).coords());
    ctx.stroke();
}

/**
 *
 * @param ctx
 * @param {AircraftGuided} aircraft
 * @param {String} color
 */
export const renderAircraftGuided = (ctx, aircraft, color = '#f0f0f0') => {
    aircraft.sightLines.forEach(({line, from, to}) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle= "#009a9e";
        ctx.beginPath();
        ctx.moveTo(...from.coords());
        ctx.lineTo(...to.coords());
        ctx.stroke();
    });
    renderAircraft(ctx, aircraft, color);
}