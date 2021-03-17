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
        console.log(bounds(data), data);
        ctx.lineTo(...coordsToCanvas(canvas)([0, data.length], data, i, data[i]));
    }
    ctx.stroke();
};

const coordsToCanvas = (canvas) => (data_x, data_y, x, y) => [
    convertRange(x, bounds(data_x), [0, canvas.width]),
    canvas.height - convertRange(y, bounds(data_y), [0, canvas.height]),
];

const bounds = data => [Math.min(...data), Math.max(...data)];

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}