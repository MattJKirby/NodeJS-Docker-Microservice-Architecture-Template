import React, { useState } from 'react';
import "./index.css";

export default () => {
    const [count, setCount] = useState(0);

    return (
        <div className='home__basicCounter__container'>
            <h1>Home micro-frontend</h1>
            <p>Counter value: {count}</p>
            <button onClick = {() => setCount(count + 1)}>Increase value</button>
            <button onClick = {() => setCount(0)}>Reset</button>
            <button onClick = {() => setCount(Math.pow(count,2))}>Sq</button>
            <button onClick = {() => setCount(Math.pow(count,0.5))}>Sqrt</button>
        </div>
    )
}