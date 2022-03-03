import React from 'react'
import "../Css/Colors.css";

function Colors() {
    let body = document.querySelector("body");
    let randomColors = document.querySelector(".randomColors");

    const randomColor = ()=>{
        let red = Math.floor(Math.random()*255);
        let blue = Math.floor(Math.random()*255);
        let green = Math.floor(Math.random()*255);
        let blur = (Math.random()*1);

        let color = `rgb(${red},${green},${blue})`;
        body.style.backgroundColor=color;
    }
  return (
    <><div>
        <button title='click me to change background colors' onClick={randomColor} className='randomColors'><i class="fa fa-paint-brush" aria-hidden="true"></i>
        
</button>
    </div>
    </>
  )
}

export default Colors