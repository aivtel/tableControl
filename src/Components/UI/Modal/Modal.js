import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => 
            (<React.Fragment>
                <Backdrop show={props.showEditing} clicked={props.closeEditing}/>
                <div className={classes.Modal}
                    style={{
                            transform: props.showEditing ? 'translateY(0)' : 'translateY(-100vh)',
                            opacity: props.showEditing ? '1' : '0'
                        }}>
                {props.children}
                </div>
            </React.Fragment>)
    

export default Modal;