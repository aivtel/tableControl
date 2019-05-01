import React from 'react';

const input = (props) => {
    return (
        <React.Fragment>
                <input 
                    // className={classes.Input} 
                    // value={props.value}
                    // type={props.type} 
                    placeholder={props.placeholder}
                    onChange={props.change} 
                    // onKeyPress={(e) => props.inputVal(e, z)}
                    />
        </React.Fragment>
    )
}

export default input;