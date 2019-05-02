import React from 'react';
import NavItems from '../NavItems/NavItems';
import classes from './ToggleMenu.module.css';


const toggleMenu = (props) => {
    return (
        <div className={classes.ToggleMenu}>
            <NavItems />
        </div>
    )
}

export default toggleMenu