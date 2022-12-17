import React from 'react'

export default function Answer(props) {
    const styles = {
        backgroundColor: props.isSelected ? 'hsl(230deg 61% 90%)' : 'white',
        fontWeight: props.isSelected ? 'bold' : 'normal',
        border: props.isSelected ? 'none' : '1px solid hsl(230deg 34% 46%)'
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
