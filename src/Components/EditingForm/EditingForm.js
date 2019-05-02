import React, {Component} from 'react';
import Input from '../Input/Input';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';
import classes from './EditingForm.module.css';


class EditingForm extends Component {

    state = {};

    inputChangedHandler = (event, index) => {
        this.setState({[index]: event.target.value}) 
    };

    closeAndEdit = () => {
        this.props.editHandler(this.state);
        this.props.close()
    };


    render() {
        return (<div>
                   {this.props.headers.map((e, index) => 
                        <React.Fragment key={'fragment' + index}>
                                <h3 key={'h3' + index}>{e.value}</h3>
                                <Input key={'EditingInput' + index} 
                                        placeholder={"  New value of " + e.value}
                                        change={(event) => this.inputChangedHandler(event, index)}
                                        />
                            </React.Fragment>)}
                    <button 
                        style={{display: 'block'}} 
                        className={classes.Button} 
                        onClick={() => this.closeAndEdit()}>
                            Update
                    </button>
                </div>)
    }
};

const mapStateToProps = (state) => {
    return {
        headers: state.headers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editHandler: (data) => dispatch(actions.editHandler(data))  
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditingForm);