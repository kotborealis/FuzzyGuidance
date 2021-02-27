import {svgGrid} from './svgGrid';

const width = 500;
const height = 50;

/**
 *
 * @param selector
 * @param color
 * @returns {function(...[*]=)}
 * @constructor
 */
export const ChartAngle = (canvas, data, color = "#4c0000") => {
    canvas.width = width;
    canvas.height = height;

    const k = 12;

    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(svgGrid.current)
        ctx.drawImage(svgGrid.current, 0, 0);
    ctx.beginPath();
    ctx.moveTo(0, -data[0] * k + canvas.height / 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for(let i = 1; i < data.length; i++){
        ctx.lineTo(i * canvas.width / 100, -data[i] * k + canvas.height / 2);
    }
    ctx.stroke();
};