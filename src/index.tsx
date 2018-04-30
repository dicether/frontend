import 'babel-polyfill';
import * as React from 'react';
import {render} from 'react-dom';
import 'what-input';

import Root from './Root';
import './googleanalytics';
import './util/prototypes';
import './config/interceptors';
import {store} from "./store";


const root = document.getElementById('root');
if (root !== null) {
    render(
        <Root store={store}/>,
        root
    );
}
