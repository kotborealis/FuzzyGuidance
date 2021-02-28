import React from 'react';
import {useForm} from "react-hook-form";
import {Vector} from '../model/vector/Vector';
import {Universe} from '../model/entities/Universe';

export const UniverseParams = ({state}) => {
    const {register, handleSubmit} = useForm();
    const {enemy, uav} = state.params;
    const onSubmit = (params) => {
        params.enemy.pos = Vector.fromObject(params.enemy.pos);
        params.enemy.speed *= 1;
        params.enemy.angle *= 1;
        params.enemy.angleSpeed *= 1;
        params.uav.pos = Vector.fromObject(params.uav.pos);
        params.uav.speed *= 1;
        state.params = params;
        state.generation++;
        state.universe = new Universe({...state.params});
        state.universe.start(1 / 10);
    };

    const handleSave = () => {
        const trace_uav_crisp = state.universe.worlds.fuzzy.uav.trace;
        const trace_uav_fuzzy = state.universe.worlds.fuzzy.uav.trace;

        const handle = (trace, type, hash) => {
            let buffer = `angle_speed,approach_velocity,distance,sightline_angle`;
            for(let i = 0; i < trace.size; i++)
                buffer +=
                    `\n${trace.angle_speed[i]},${trace.approach_velocity[i]},${trace.distance[i]},${trace.sightline_angle[i]}`;

            const file = new Blob([buffer], {type: 'text/csv'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = `${hash}_uav_${type}.csv`;
            a.click();
            URL.revokeObjectURL(a.href);
        };

        handle(trace_uav_crisp, 'crisp', Date.now());
        handle(trace_uav_fuzzy, 'fuzzy', Date.now());
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-semibold">Параметры моделирования</h1>
            <div className="grid grid-cols-2">
                <div>
                    <h1 className="text-xl font-semibold">Цель наведения</h1>
                    <div>
                        <label>Координаты</label>
                        <div className="grid grid-cols-2">
                            <label>x</label>
                            <input
                                type="number" step="0.01"
                                name="enemy.pos.x"
                                defaultValue={enemy.pos.x}
                                ref={register}
                            />
                            <label>y</label>
                            <input
                                type="number" step="0.01"
                                name="enemy.pos.y"
                                defaultValue={enemy.pos.y}
                                ref={register}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Скорость</label>
                        <input
                            type="number" step="0.01"
                            name="enemy.speed"
                            defaultValue={enemy.speed}
                            ref={register}
                        />
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Угол</label>
                        <input
                            type="number" step="0.01"
                            name="enemy.angle"
                            defaultValue={enemy.angle}
                            ref={register}
                        />
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Угловая скорость</label>
                        <input
                            type="number" step="0.01"
                            name="enemy.angleSpeed"
                            defaultValue={enemy.angleSpeed}
                            ref={register}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-semibold">Объект управления</h1>
                    <div>
                        <label>Координаты</label>
                        <div className="grid grid-cols-2">
                            <label>x</label>
                            <input
                                type="number" step="0.01"
                                name="uav.pos.x"
                                defaultValue={uav.pos.x}
                                ref={register}
                            />
                            <label>y</label>
                            <input
                                type="number" step="0.01"
                                name="uav.pos.y"
                                defaultValue={uav.pos.y}
                                ref={register}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <label>Скорость</label>
                        <input
                            type="number" step="0.01"
                            name="uav.speed"
                            defaultValue={uav.speed}
                            ref={register}
                        />
                    </div>
                </div>
            </div>
            <input type="submit" value="Задать параметры" className="w-full"/>
            <input onClick={handleSave}
                   type="button" value="Сохранить результаты моделирования (CSV)" className="w-full"/>
        </form>
    );
};