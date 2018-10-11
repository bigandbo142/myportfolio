import { TEST_DISPATCH, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "../actions/types";
import isEmpty from '../utils/is-empty';

const initialState = {
    is_authenticated : false,
    user : {}
}

export default function(state = initialState, action) {
    switch(action.type){
        case TEST_DISPATCH:
            return {
                ...state,
                user : action.payload
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user : action.payload
            }
        case LOGIN_FAILURE:
            return action.payload
        default:
            return state
    }
}
