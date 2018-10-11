import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS, GET_ERRORS }  from './types'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'

export const registerUser =  (userData, history) => async(dispatch) => {

    try{
        let res = await axios.post('/api/users/register', userData)
        if(res.status === 200){
            history.push('/login')
        }
    }catch(err){
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    }
}

export const loginUser = (userData) => async(dispatch) => {
    try{
        let res = await axios.post('/api/users/login', userData)
        if(res.status === 200){
            // save token to local storage
            localStorage.setItem('jwt_token', res.data.token)

            // set token to all axios request from now on

            setAuthToken(res.data.token)

            // decode token for retrieving user's data
            const user = jwt_decode(res.data.token)

            // dispatch data
            dispatch({
                type: LOGIN_SUCCESS,
                payload: user
            })
        }
    }catch(err){
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    }
}