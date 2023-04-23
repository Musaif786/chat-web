import React,{useEffect} from 'react';
import "../Css/Main.css";
import { useHistory , Link } from "react-router-dom";
import { Chatbot } from '../components/Chatbot';


function Main() {

  
  const img = "https://source.unsplash.com/200x200/?socialmedia";
  useEffect(()=>{

    const img = "https://source.unsplash.com/200x200/?socialmedia";

  },[img])
  return (
      <>
<main className='main' >
<div>
<div className='main-imgbox'>

  <img src={img} alt="" />
</div>
</div>
  <div className='main1'>
  
  <h3 className='mainh3'>Welcome To Musaif Communication Website</h3>
  <Chatbot/>
    <p className='mainp'>
  <hr />
    
    Purpose of this website are to connect people together, communicating with friends and family members, conversations are end-to-end and fully secure communication for more <button className='btn1'><Link to="/login">Explore</Link>  </button>
    <hr /> 
    <marquee style={{color:""}} > Welcome to musaif world, creator, developer and programmer <a target="_blank" style={{textDecoration:"none",color:"blue"}} href="https://wa.me/+917995587687 ">Contact us <i class="fa fa-whatsapp" aria-hidden="true"></i>
</a> </marquee>
    {/* <hr />
    Features of this website 
    <hr /> */}
      {/* <ol style={{fontSize:"18px"}}>
        <li>chatting</li>
        <li>end to end communication</li>
        <li>user interface</li>
        <li>background color custom</li>
        <li>profile changing </li>
        <li>edit username</li>
      </ol> */}
    </p>
  </div>
</main>
      </>
  )
}

export default Main