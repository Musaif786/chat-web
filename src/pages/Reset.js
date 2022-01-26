import React, { useState } from 'react';
import {  sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import "../Css/Reset.css";

function Reset() {
    const [email, setEmail] = useState("");


//reset pass 
const reset = (e)=>{
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
       toast.success("Reset link send to your gmail");
      })
      .catch((err) => {
        toast.error(err.message);
      });
      }

  return <>
      <div>
      <div className='Reset'>

          <form  className='reset-form'>
          <h5 className=''>Enter your email address</h5>
          <label htmlFor="email">Gmail</label>
              <input type="email" name='email' value={email} id='email' onChange={(e)=>{setEmail(e.target.value)}} placeholder='your email..' />
             
          <div className='reset-btn' >
          <button onClick={reset}  className=''>sumbit</button>

          </div>
          </form>
      </div>
      </div>
  </>;
}

export default Reset;
