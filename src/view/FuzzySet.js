import {svgGrid} from './svgGrid';

import {FuzzySetBound, FuzzySetLIMFN} from '../model/fuzzy/fuzzy';
import {Vector} from '../model/vector/Vector';
import {FuzzySetLIMFP} from '../model/fuzzy/FuzzySetLIMFP';

const width = 500;
const height = 100;

const handleRadius = 10;

export const renderFuzzySet = (selector, fuzzyVar, boundsX = [0, 1]) => {
    const canvas = document.querySelector(selector);
    canvas.width = width;
    canvas.height = height;
    const colors = "black blue blueviolet chocolate crimson magenta".split(' ');
    const toCanvas = coordsToCanvas(canvas, boundsX);
    const fromCanvas = coordsFromCanvas(canvas, boundsX);

    let mousePos = new Vector();

    setInterval(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(svgGrid)
            ctx.drawImage(svgGrid.current, 0, 0);

        Object.entries(fuzzyVar.fset).map(([name, set], index) => {
            ctx.strokeStyle = colors[index % colors.length];
            ctx.fillStyle = colors[index % colors.length];
            ctx.lineWidth = 2;
            const points = FuzzySetBound.toArray(set.bounds);
            ctx.beginPath();
            if(set instanceof FuzzySetLIMFN){
                ctx.moveTo(...toCanvas(boundsX[0], 1));
                ctx.lineTo(...toCanvas(...points[0]));
            }
            ctx.moveTo(...toCanvas(...points[0]));
            for(let i = 1; i < points.length; i++)
                ctx.lineTo(...toCanvas(...points[i]));
            if(set instanceof FuzzySetLIMFP){
                ctx.moveTo(...toCanvas(boundsX[1], 1));
                ctx.lineTo(...toCanvas(...points[points.length - 1]));
            }
            ctx.stroke();
        });

        Object.entries(fuzzyVar.fset).map(([name, set], index) => {
            ctx.strokeStyle = colors[index % colors.length];
            ctx.fillStyle = colors[index % colors.length];
            ctx.lineWidth = 2;
            FuzzySetBound.toArray(set.bounds).forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(...toCanvas(x, y), handleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
            });
        });
    }, 1 / 20);

    let enableDrag = true;
    let dragged = null;


    const eventToXY = ({clientX, clientY, target}) => {
        const {left, top} = target.getBoundingClientRect();
        return [clientX - left, clientY - top];
    };

    canvas.addEventListener('mousedown', (e) => {
        enableDrag = true;

        const min = {value: null, distance: 9999};

        Object.entries(fuzzyVar.fset).map(([name, set], index) =>
            set.bounds.map(bound => {
                const d = (new Vector(...toCanvas(bound.x, bound.y))).distance(mousePos);
                if(d <= min.distance){
                    min.distance = d;
                    min.value = bound;
                }
            })
        );

        dragged = min.value;
    });

    canvas.addEventListener('mouseup', () => {
        enableDrag = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        mousePos = new Vector(...eventToXY(e));
        if(!enableDrag || !dragged) return;
        dragged.x = fromCanvas(mousePos.x, 0)[0];
    });
};

const coordsToCanvas = (canvas, boundsX) => (x, y) => [
    convertRange(x, boundsX, [0, canvas.width]),
    canvas.height - convertRange(y, [0, 1], [0, canvas.height - 20]) - 10
];
const coordsFromCanvas = (canvas, boundsX) => (x, y) => [
    convertRange(x, [0, canvas.width], boundsX),
    1 - convertRange(y, [0, canvas.height], [0, 1])
];

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}