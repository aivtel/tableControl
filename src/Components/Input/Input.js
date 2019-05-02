import React from 'react';

const input = (props) => {
    return (
        <React.Fragment>
                <input 
                    placeholder={props.placeholder}
                    onChange={props.change} 
                    />
        </React.Fragment>
    )
}

export default input;