import { GET_CURRENT_PROFILE, PROFILE_LOADING, PROFILE_NOT_FOUND } from './types'
import axios from 'axios'


export const getCurrentProfile = () => async(dispatch) => {
    dispatch(profileLoading())
    try{
        let profileRes = await axios.get('api/profile')
        if(profileRes.status === 200){
            dispatch({
                type: GET_CURRENT_PROFILE,
                payload: profileRes.data
            })
        }
    }catch(err){
        dispatch({
            type: PROFILE_NOT_FOUND
        })
    }

}

export const profileLoading = () => async(dispatch) => {
    dispatch({
        type: PROFILE_LOADING
    })
}