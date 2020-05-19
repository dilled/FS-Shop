import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import loginReducer from './reducers/loginReducer';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import productReducer from './reducers/productReducer';

const rootReducer = combineReducers({
	login:loginReducer,
	product:productReducer,
})

const store = createStore(rootReducer,applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
  <Provider store={store}>
	<BrowserRouter>
		<App />
	</BrowserRouter>
  </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
