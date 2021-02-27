import React, {useRef} from 'react';
import {renderGuidanceValues, renderGuidanceView} from '../view/GuidanceView';

export const WorldView = ({name, world}) => {
    const guidanceView = useRef(null);
    const chartV = useRef(null);
    const valueVInt = useRef(null);
    const valueVFloat = useRef(null);
    const chartD = useRef(null);
    const valueDInt = useRef(null);
    const valueDFloat = useRef(null);
    const chartOmega = useRef(null);
    const valueOmegaInt = useRef(null);
    const valueOmegaFloat = useRef(null);
    const chartAlpha = useRef(null);
    const valueAlphaInt = useRef(null);
    const valueAlphaFloat = useRef(null);

    renderGuidanceView(guidanceView, world);
    renderGuidanceValues(
        chartV,
        valueVInt,
        valueVFloat,
        chartD,
        valueDInt,
        valueDFloat,
        chartOmega,
        valueOmegaInt,
        valueOmegaFloat,
        chartAlpha,
        valueAlphaInt,
        valueAlphaFloat,
        world
    );

    return (<div className="shadow-md p-2 flex space-x-4 flex-col">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <canvas ref={guidanceView}/>
        <table>
            <tbody>
            <tr>
                <td>Скорость сближения (v)</td>
                <td ref={valueVInt}/>
                <td className="guidance-value-dot">.</td>
                <td ref={valueVFloat}/>
            </tr>
            <tr>
                <td colSpan="4">
                    <canvas ref={chartV}/>
                </td>
            </tr>
            <tr>
                <td>Расстояние (d)</td>
                <td ref={valueDInt}/>
                <td className="guidance-value-dot">.</td>
                <td ref={valueDFloat}/>
            </tr>
            <tr>
                <td colSpan="4">
                    <canvas ref={chartD}/>
                </td>
            </tr>
            <tr>
                <td className="guidance-value-label">Угол линии обзора (&omega;)</td>
                <td ref={valueOmegaInt}/>
                <td className="guidance-value-dot">.</td>
                <td ref={valueOmegaFloat}/>
            </tr>
            <tr>
                <td colSpan="4">
                    <canvas ref={chartOmega}/>
                </td>
            </tr>
            <tr>
                <td className="guidance-value-label">Угловая скорость (&alpha;)</td>
                <td ref={valueAlphaInt}/>
                <td className="guidance-value-dot">.</td>
                <td ref={valueAlphaFloat}/>
            </tr>
            <tr>
                <td colSpan="4">
                    <canvas ref={chartAlpha}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
};