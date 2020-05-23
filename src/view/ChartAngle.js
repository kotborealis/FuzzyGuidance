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
export const ChartAngle = (selector, color="#4c0000") => {
    const canvas = document.querySelector(selector);

    const k = 12;

    let data;

    setInterval(() => {
        const ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(svgGrid.current)
            ctx.drawImage(svgGrid.current, 0, 0);
        ctx.beginPath();
        ctx.moveTo(0, -data[0]*k+canvas.height/2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        for(let i = 1; i < data.length; i++) {
            ctx.lineTo(i * canvas.width / 100 , -data[i]*k+canvas.height/2);
        }
        ctx.stroke();
    }, 1/20);

    return (_data) => {
        data = _data;
    };
};