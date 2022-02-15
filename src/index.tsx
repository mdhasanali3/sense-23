import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import {AppInitializer} from './logic/initializer/AppInitializer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import { Switch } from 'react-router-dom'
import Prediction from './prediction/Prediction'


export const store = configureStore();
AppInitializer.inti();

ReactDOM.render(
    (<Provider store={store}>
        <BrowserRouter>
        <Routes>
           

            <Route path='/' element= {<App/>}/>
        <Route path='/prediction' element= {<Prediction/>}/>

           

        </Routes>
        </BrowserRouter>
        
    </Provider>),
    document.getElementById('root') || document.createElement('div') // fix for testing purposes
);

serviceWorker.unregister();
