import React, {useRef} from 'react';
import {renderGuidanceValues, renderGuidanceView} from '../view/GuidanceView';

export const WorldView = ({name, type, state}) => {
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

    renderGuidanceView(guidanceView, state, type);
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
        state, type
    );

    return (<div className="shadow-md p-2 flex space-x-4 flex-col">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <canvas ref={guidanceView}/>
        <table>
            <tbody>
            <tr>
                <td>Скорость сближения (v)</td>
                <td>
                    <span ref={valueVInt}/>
                    <span className="guidance-value-dot">.</span>
                    <span ref={valueVFloat}/>
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                    <canvas ref={chartV}/>
                </td>
            </tr>
            <tr>
                <td>Расстояние (d)</td>
                <td>
                    <span ref={valueDInt}/>
                    <span className="guidance-value-dot">.</span>
                    <span ref={valueDFloat}/>
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                    <canvas ref={chartD}/>
                </td>
            </tr>
            <tr>
                <td className="guidance-value-label">Угол линии обзора (&omega;)</td>
                <td>
                    <span ref={valueOmegaInt}/>
                    <span className="guidance-value-dot">.</span>
                    <span ref={valueOmegaFloat}/>
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                    <canvas ref={chartOmega}/>
                </td>
            </tr>
            <tr>
                <td className="guidance-value-label">Угловая скорость (&alpha;)</td>
                <td>
                    <span ref={valueAlphaInt}/>
                    <span className="guidance-value-dot">.</span>
                    <span ref={valueAlphaFloat}/>
                </td>
            </tr>
            <tr>
                <td colSpan="2">
                    <canvas ref={chartAlpha}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
};