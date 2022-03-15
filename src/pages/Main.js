import React,{useEffect} from 'react';
import "../Css/Main.css";

function Main() {

  
  const img = "https://source.unsplash.com/200x200/?whatsapp";
  useEffect(()=>{

    const img = "https://source.unsplash.com/200x200/?chatting";

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
  
  <h3 className='mainh3'>Welocme To Musaif Communication Website</h3>
  
    <p className='mainp'>
    
    Purpose of this website only for communication secret and end to end communication chat for more <button className='btn1'>Explore  </button>
    <hr /> 
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