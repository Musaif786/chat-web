import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth';
import "../Css/Darkmode.css";

function Darkmodebtn() {

 const {togglebtn} = useContext( AuthContext)

 const OnlyDarkbtn =()=>{
   let body = document.querySelector("body");
  //  let ball = document.querySelector(".ball");

     body.classList.toggle("darkbtn");
    
 }

  return(<>  <footer >
  <div  className='darkmode-wrapper'>
      <input type="checkbox" name="" className='checkbox' id="darkbtn" />
      <label className='label' onClick={OnlyDarkbtn}  htmlFor="darkbtn"> 
      <span className='one'>

      <i class="fa fa-sun-o" aria-hidden="true"></i>
      </span>
      <span className='two'>

      <i class="fa fa-moon-o" aria-hidden="true"></i>
      </span>
      <span onClick={togglebtn}  className='ball'> </span>

      </label>
  </div>
  </footer> </>);
}

export default Darkmodebtn;
