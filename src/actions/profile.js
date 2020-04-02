import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE,PROFILE_ERROR, GET_PROFILES, CLEAR_PROFILE, GET_REPOS } from './types';

//get the current users profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (error) {
         dispatch({
             type: PROFILE_ERROR,
             payload: { msg: error?.response?.statusText, status: error?.response?.status}
         })
    }
}


//get all profile
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    } catch (error) {
         dispatch({
             type: PROFILE_ERROR,
             payload: { msg: error?.response?.statusText, status: error?.response?.status}
         })
    }
}


export const getProfileById = userId => async dispatch => {
    
    try {
        const res = await axios.get(`/api/profile/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (error) {
         dispatch({
             type: PROFILE_ERROR,
             payload: { msg: error?.response?.statusText, status: error?.response?.status}
         })
    }
}

export const getGithubRepos = username => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get(`/api/profile/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });

    } catch (error) {
         dispatch({
             type: PROFILE_ERROR,
             payload: { msg: error?.response?.statusText, status: error?.response?.status}
         })
    }
}


//create or update profile
export const createProfile = (FormData, history, edit = false) => async dispatch =>{
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
         
        const res = await axios.post('/api/profile', FormData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated': 'Profile Created', 'success'));

        if(!edit) {
            history.push('/dashboard');
        }

    } catch (error) {
        const errors = error?.response?.data?.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: errors?.response?.statusText, status: errors?.response?.status}
        })
    }
}