import { GET_CURRENT_PROFILE, PROFILE_NOT_FOUND, PROFILE_LOADING } from '../actions/types'

const initialState = {
    loading : false,
    profile : null,
    profiles : null
}

export default function(state = initialState, action) {
    switch(action.type){ 
        case GET_CURRENT_PROFILE:
            return {
                ...state,
                loading: false,
                profile: action.payload
            }
        
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            }

        case PROFILE_NOT_FOUND:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}