import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middlewares = [thunk]

const initialState = {}

const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))

export default store;