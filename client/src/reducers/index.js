import { combineReducers } from 'redux'
import authReducer from './authReducer'
import profileReducer from './profileReducer'
import errorReducer from './errorReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    errors: errorReducer
})

export default rootReducer