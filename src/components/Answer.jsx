import React from 'react'

export default function Answer(props) {
    const styles = {
        backgroundColor: props.isSelected ? 'hsl(230deg 61% 90%)' : 'white',
        fontWeight: props.isSelected ? 'bold' : 'normal',
    }

    return (
        <button 
        className="ans-btn" 
        style={props.hasBeenChecked ? props.styleAfterCheck : styles} 
        onClick={props.selectAnswer}>
            {props.text}
        </button>
    )
}
