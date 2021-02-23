/**
 *
 * @param {Vector} a1
 * @param {Vector} a2
 * @param {Vector} b1
 * @param {Vector} b2
 * @param {Number} delta
 * @returns {Vector|null}
 */
import {Vector} from './Vector';

export function lineIntersection (a1, a2, b1, b2, delta = 0.001) {
    const {x: x1, y: y1} = a1;
    const {x: x2, y: y2} = a2;
    const {x: x3, y: y3} = b1;
    const {x: x4, y: y4} = b2;

    const A1 = y2-y1;
    const B1 = x1-x2;
    const C1 = A1*x1 + B1*y1;
    const A2 = y4-y3;
    const B2 = x3-x4;
    const C2 = A2*x3 + B2*y3;
    const det = A1*B2-A2*B1;
    if(det !== 0){
        const x = (B2*C1 - B1*C2)/det;
        const y = (A1*C2 - A2*C1)/det;
        if(x >= Math.min(x1, x2) - delta && x <= Math.max(x1, x2) + delta
           && x >= Math.min(x3, x4) - delta && x <= Math.max(x3, x4) + delta
           && y >= Math.min(y1, y2) - delta && y <= Math.max(y1, y2) + delta
           && y >= Math.min(y3, y4) - delta && y <= Math.max(y3, y4)+ delta
        )
            return new Vector(x, y);
    }
    return null;
}

/**
 *
 * @param {Vector} a
 * @param {Vector} b
 * @param {Vector} point
 * @returns {Vector}
 */
export function closestPointOnLine(a, b, point) {
    const {x: lx1, y: ly1} = a;
    const {x: lx2, y: ly2} = b;
    const {x: x0, y: y0} = point;

    const A1 = ly2 - ly1;
    const B1 = lx1 - lx2;
    const C1 = (ly2 - ly1)*lx1 + (lx1 - lx2)*ly1;
    const C2 = -B1*x0 + A1*y0;
    const det = A1*A1 - -B1*B1;
    let cx = 0;
    let cy = 0;
    if(det !== 0){
        cx = (A1*C1 - B1*C2)/det;
        cy = (A1*C2 - -B1*C1)/det;
    }else{
        cx = x0;
        cy = y0;
    }
    return new Vector(cx, cy);
}

/**
 *
 * @param {Vector} a
 * @param {Vector} b
 * @param {Vector} point
 * @return {Boolean}
 */
export function isPointOnLine(a, b, point){
    const dxc = point.x - a.x;
    const dyc = point.y - a.y;

    const dxl = b.x - a.x;
    const dyl = b.y - a.y;

    const cross = dxc * dyl - dyc * dxl;

    if(cross !== 0)
        return false;

    if (Math.abs(dxl) >= Math.abs(dyl))
        return dxl > 0 ?
            a.x <= point.x && point.x <= b.x :
            b.x <= point.x && point.x <= a.x;
    else
        return dyl > 0 ?
            a.y <= point.y && point.y <= b.y :
            b.y <= point.y && point.y <= a.y;
}