import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';

ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/autor'/>
                <Route path='/livro'/>
            </Switch>
        </App>
    </Router>),
    document.getElementById('root')
);
registerServiceWorker();
