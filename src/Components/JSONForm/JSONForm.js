import React, {Component} from 'react';
import Input from '../Input/Input';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';


class JSONForm extends Component {

    state = {};

    inputChangedHandler = (event) => {
        this.setState({url: event.target.value}) 
    };

    closeAndEdit = () => {
        this.props.getDataJSON(this.state.url);
        this.props.close()
    };


    render() {
        return (<div>
                    <p>Type new JSON data URL</p>
                    <p>example: https://jsonplaceholder.typicode.com/albums</p>
                   <Input
                        placeholder={"  New URL of JSON Data"}
                        change={(event) => this.inputChangedHandler(event)}
                    />
                   <button style={{margin: '0 10px'}} onClick={() => this.closeAndEdit()}>Get New Data</button>
                </div>)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDataJSON: (url) => dispatch(actions.getDataJSON(url)) 
    }
};

export default connect(null, mapDispatchToProps)(JSONForm);