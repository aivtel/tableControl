import React, {Component} from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    render() {
        return (
            <React.Fragment>
                <Backdrop show={this.props.showEditing} clicked={this.props.closeEditing}/>
                <div className={classes.Modal}
                    style={{
                            transform: this.props.showEditing ? 'translateY(0)' : 'translateY(-100vh)',
                            opacity: this.props.showEditing ? '1' : '0'
                        }}>
                {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default Modal;