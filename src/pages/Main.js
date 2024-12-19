import React, { useEffect, useState } from 'react';
import "../Css/Main.css";
import { useHistory, Link } from "react-router-dom";
import { Chatbot } from '../components/Chatbot';
import { fetchRandomPhoto } from '../components/api.js';


function Main() {

  const [randomPhoto, setRandomPhoto] = useState('');

  const img = "https://source.unsplash.com/200x200/?socialmedia";
  useEffect(() => {

    const img = "https://source.unsplash.com/200x200/?socialmedia";
    fetchRandomPhoto(setRandomPhoto);

  }, [img])
  return (
    <>
      <main className='main' >
        <div>
          <div className='main-imgbox'>

            <img src={randomPhoto} alt="" />
          </div>
        </div>
        <div className='main1'>

          <h3 className='mainh3 typing-effect'>Welcome To Musaif Communication Website</h3>
          <Chatbot />
          <p className="mainp ">
        The purpose of this website is to bring people together, enabling secure and seamless communication with friends and family. All conversations are end-to-end encrypted for complete privacy. Ready to connect? 
        <button className="btn1">
          <Link to="/login">Explore</Link>
        </button>
        <hr />
      </p>
        </div>
      </main>
      
    </>
  )
}

export default Main