import { TEST_DISPATCH, GET_ERRORS }  from './types'
import axios from 'axios'

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