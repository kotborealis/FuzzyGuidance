import React from "react";
import {render} from "react-dom";
import {WorldView} from './components/WorldView.jsx';
import {Vector} from './model/vector/Vector';
import {Universe} from './model/entities/Universe';
import {UniverseParams} from './components/UniverseParams.jsx';

const state = {
    generation: 0,
    universe: null,
    params: {
        enemy: {
            pos: new Vector(300, 300),
            speed: 10,
            angle: 0,
            angleSpeed: -5 / 25,
        },
        uav: {
            pos: new Vector(500, 500),
            speed: 15,
        }
    }
};

state.universe = new Universe({...state.params});
state.universe.start(1 / 10);

render(
    <div className>
        <div className="container mx-auto
    bg-white rounded-xl shadow-xl p-6
    grid grid-cols-1 gap-4">
            <UniverseParams state={state}/>
        </div>
        <div className="container mx-auto
    bg-white rounded-xl shadow-xl p-6
    grid grid-cols-2 gap-4">
            <WorldView
                name={'Пропорциональное наведение'}
                type='crisp'
                state={state}
            />
            <WorldView
                name={'Нечёткое наведение'}
                type='fuzzy'
                state={state}
            />
        </div>
    </div>,
    document.getElementById('App')
);