import {loading,endLoading} from './loginActions';

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS"
export const FETCH_PRODUCTS_FAILED = "FETCH_PRODUCTS_FAILED"


export const getProducts = () => {
	return dispatch => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-type":"application/json" }
		}
		
        dispatch(loading());
        fetch("/shop/products", request).then(response => {
            dispatch(endLoading());
            if (response.ok) {
                console.log("1", response);
                response.json().then(data => {
                    dispatch(fetchProductsSuccess(data))
                    console.log("2", data);
                    
                }).catch(error => {
                    dispatch(fetchProductsFailed("Failed to parse information. Try again"));
                })
            } else {
                console.log("No data");
                dispatch(fetchProductsFailed("Server responded with status:"+response.statusText));
            }
        }).catch(error => {
            console.log(error);
            dispatch(endLoading());
			dispatch(fetchProductsFailed("Server responded with an error:"+error));
        })
		
	}
}

export const fetchProductsSuccess = (data) => {
	return {
		type:FETCH_PRODUCTS_SUCCESS,
        categories: data
	}
}

export const fetchProductsFailed = (error) => {
	return {
		type:FETCH_PRODUCTS_FAILED,
		error:error
	}
}