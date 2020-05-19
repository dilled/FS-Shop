

export const LOADING = "LOADING"
export const END_LOADING = "END_LOADING"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAILED = "REGISTER_FAILED"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILED = "LOGIN_FAILED"
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS"
export const LOGOUT_FAILED = "LOGOUT_FAILED"

export const onRegister = (user) => {
    return dispatch => {
        let request = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }
        dispatch(loading());
        fetch("/shop/user/register", request).then(response => {
            if (response.ok) {
                alert("Register success");
                dispatch(registerSuccess());
            } else {
                alert("Register failed. Is username already in use?");
                dispatch(registerFailed("Register failed. Is username already in use?"));
            }
        }).catch(error => {
            dispatch(registerFailed(error));
        })
    }
}

export const onLogin = (user) => {
    return dispatch => {
        let request = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }
        dispatch(loading());
        fetch("/shop/user/login", request).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("login response OK");
                    dispatch(loginSuccess(data));
                    
                }).catch(error => {
                    dispatch(loginFailed("Failed to parse response. Reason:"+error))
                })
            } else {
                dispatch(loginFailed("Login failed. Please provide proper credentials."))
            }
        }).catch(error => {
            dispatch(loginFailed(error));
        })
    }
}

export const onLogout = (token) => {
    console.log("logout.js logout state:" + JSON.stringify(token))
    return dispatch => {
        let request = {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json", "token": token }
        }
        fetch("/shop/user/logout", request).then(response => {
            console.log("Logout kutsuttu");
            if(response.ok) {
                dispatch(logoutSuccess());
                //dispatch(clearContactReducerState());
            } else {
                dispatch(logoutFailed("Server responded with an error. Logging out"))
            // dispatch(clearContactReducerState());
            }
        }).catch(error => {
            dispatch(logoutFailed("Server responded with an error. Error:"+error))
            //dispatch(clearContactReducerState());
            return false;
        }).finally(() => {
            console.log("Finally")
            return true;
        })
    }
}

//Reducer Action Creators

export const loading = () => {
	return {
		type:LOADING
	}
}

export const endLoading = () => {
	return {
		type:END_LOADING
	}
}

export const registerSuccess = () => {
	return {
		type:REGISTER_SUCCESS
	}
}

export const registerFailed = (error) => {
	return {
		type:REGISTER_FAILED,
		error:error
	}
}

export const loginSuccess = (data) => {
	return {
		type:LOGIN_SUCCESS,
        token:data.token,
        nickname:data.nickname
	}
}

export const loginFailed = (error) => {
	return {
		type:LOGIN_FAILED,
		error:error
	}
}

export const logoutSuccess = () => {
	return {
		type:LOGOUT_SUCCESS
	}
}

export const logoutFailed = (error) => {
	return {
		type:LOGOUT_FAILED
	}
}