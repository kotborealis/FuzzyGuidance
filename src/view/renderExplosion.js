/**
 *
 * @param ctx
 * @param {Aircraft} aircraft
 */
import {explosion} from './explosionGraphics';

export const renderExplosion = (ctx, aircraft) => {
    ctx.save();
    ctx.translate(...aircraft.position.coords());
    ctx.rotate(aircraft.angle);
    if(explosion.current)
        ctx.drawImage(explosion.current, -20, -20, 40, 40);
    ctx.restore();
};