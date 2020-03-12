import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS,LOGIN_FAIL} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
};

const reducer =  (state = initialState, action) => {
    console.log(action.payload)
    switch(action.type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action?.payload?.token);
            return {
                ...state,
                token:action?.payload?.token,
                isAuthenticated: true,
                loading: false
            };
            case REGISTER_FAIL:
            case AUTH_ERROR: 
            case LOGIN_FAIL: 
              
                localStorage.removeItem('token');
              
                return {
                    ...state,
                    token: null,
                    isAuthenticated: false,
                    loading: false
                }
                default:
                    return state;
    }

}

export default reducer;