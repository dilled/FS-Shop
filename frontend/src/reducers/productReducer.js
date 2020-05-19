import {
	FETCH_PRODUCTS_SUCCESS,
	FETCH_PRODUCTS_FAILED,
	
} from '../actions/productActions';

const getInitialStateFromStorage = () => {
	if(sessionStorage.getItem("productstate")) {
		let productstate = JSON.parse(sessionStorage.getItem("productstate"))
		return productstate
	} else {
		return {
            categories:[],
			error:"",
		}		
	}
}

const saveToStorage = (state) => {
	sessionStorage.setItem("productstate",JSON.stringify(state));
}

const initialState = getInitialStateFromStorage();

const productReducer = (state=initialState,action) => {
	let tempState = {};
	switch(action.type) {
		case FETCH_PRODUCTS_SUCCESS:
			tempState = {
				...state,
                categories:action.categories,
				error:""
			}
			saveToStorage(tempState);
			return tempState;
		case FETCH_PRODUCTS_FAILED:
			tempState = {
				...state,
				error:action.error
			}
			saveToStorage(tempState);
            return tempState;
        default:
            return state;
    }
}
    
export default productReducer;