import React from 'react';


export default class Error extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: ""
        }
    }
    render() {
        if (errorText !== "") {
            errorText = "";
            return (
                <Fragment>
                    <div className={"fs-error-main"}>
                        errorText
            </div>
                </Fragment >
            )
        }
    }
}