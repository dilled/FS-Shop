import {
	LOADING,
	END_LOADING,
	REGISTER_SUCCESS,
	REGISTER_FAILED,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	LOGOUT_SUCCESS,
	LOGOUT_FAILED
} from '../actions/loginActions'

const getInitialStateFromStorage = () => {
	if(sessionStorage.getItem("loginstate")) {
		let loginstate = JSON.parse(sessionStorage.getItem("loginstate"))
		return loginstate
	} else {
		return {
			token:"",
			isLogged:false,
			loading:false,
			nickname:"",
			error:""			
		}		
	}
}

const saveToStorage = (state) => {
	sessionStorage.setItem("loginstate",JSON.stringify(state));
}

const initialState = getInitialStateFromStorage();

const loginReducer = (state = initialState, action) => {
	let tempState = {}
	switch(action.type) {
		case LOADING:
			return {
				...state,
				loading:true,
				error:""
			}
		case END_LOADING:
			return {
				...state,
				loading:false,
				error:""
			}
		case REGISTER_SUCCESS:
			tempState = {
				...state,
				error:"",
				loading:false
			}
			saveToStorage(tempState);
			return tempState;
		case REGISTER_FAILED:
			tempState = {
				...state,
				loading:false,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		case LOGIN_SUCCESS:
			tempState = {
				isLogged:true,
				token:action.token,
				nickname:action.nickname,
				error:"",
				loading:false
			}
			saveToStorage(tempState);
			return tempState;
		case LOGIN_FAILED:
			tempState = {
				...state,
				error:action.error,
				loading:false
			}
			saveToStorage(tempState);
			return tempState;
		case LOGOUT_SUCCESS: 
			tempState = {
				token:"",
				isLogged:false,
				loading:false,
				error:"",
				nickname:""
			}
			saveToStorage(tempState);
			return tempState;
		case LOGOUT_FAILED: 
			tempState = {
				token:"",
				isLogged:false,
				nickname:"",
				loading:false,
				error:action.error
			}
			saveToStorage(tempState);
			return tempState;
		default:
			return state;
	}
}

export default loginReducer;