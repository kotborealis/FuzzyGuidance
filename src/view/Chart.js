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
export const Chart = (canvas, data_y, color = "#013d3d") => {
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(svgGrid)
        ctx.drawImage(svgGrid.current, 0, 0);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(...coordsToCanvas(canvas)([0, data_y.length], data_y, 0, data_y[0]));
    for(let i = 1; i < data_y.length; i++){
        ctx.lineTo(...coordsToCanvas(canvas)([0, data_y.length], data_y, i, data_y[i]));
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