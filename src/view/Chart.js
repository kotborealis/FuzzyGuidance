import {svgGrid} from './svgGrid';
import {Vector} from '../vector/Vector';

/**
 *
 * @param selector
 * @param color
 * @param min
 * @param max
 * @returns {function(...[*]=)}
 * @constructor
 */
export const Chart = (selector, color="#013d3d") => {
    const canvas = document.querySelector(selector);

    const k = 10;
    console.log(canvas.height, k);

    let data;

    setInterval(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(svgGrid, 0, 0);
        ctx.beginPath();
        ctx.moveTo(0, -data[0]*k+canvas.height/2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for(let i = 1; i < data.length; i++) {
            ctx.lineTo(i * canvas.width / 100, -data[i]*k+canvas.height/2);
        }
        ctx.stroke();
    }, 1/20);

    return (_data) => {
        data = _data;
    };
};