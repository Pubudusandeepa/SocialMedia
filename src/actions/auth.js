import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types';
import setAuthToken from '../uitils/setAuthToken';


//Register User
export const register = ({ name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json ',
            'x-auth-token': localStorage.getItem('token')
           
          
      
        }
    }
    const body =  JSON.stringify({ name, email, password});
    console.log(body);
    try{
        const res = await axios.post('/api/users',body,config);
        console.log(res);
        dispatch({
            type: REGISTER_SUCCESS,
            Payload: res.data
        });
        dispatch(loadUser());
        console.log(res);
     
    }catch(error){
        // const errors = error.response.data.errors;
      
        // if(errors){
        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        // }

       dispatch({
           type: REGISTER_FAIL
       });
    }
}



//Load User
export const loadUser = () => async dispatch => {
   if(localStorage.token) {
       setAuthToken(localStorage.token);
   }
   try {
       const res = await axios.get('/api/auth');

       dispatch({
           type: USER_LOADED,
           payload: res.data
       });
   } catch (error) {
       dispatch({
           type: AUTH_ERROR
       });
   }
};



//Login User

export const login = ({ email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
            
          
        }
    }
    const body =  JSON.stringify({  email, password});

    try{
        const res = await axios.post('/api/auth',body,config);
        dispatch({
            type: LOGIN_SUCCESS,
            Payload: res.data
        });
        console.log("hiiku")
        dispatch(loadUser());
       

    }
    catch(er){
        // const errors = er.response.data.errors;
      
        // if(errors){
        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        // }

       dispatch({
           type: LOGIN_FAIL
       });
    }
}
