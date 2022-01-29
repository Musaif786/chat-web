import React,{useEffect} from 'react'
import "../Css/Loader.css";

const Loader = () => {
    
    // useEffect(()=>{

    //     let load = document.querySelector(".loading-wrapper");
    //     function loading(){
    //         load.style.display ="none";
            
    //     }
    // //    setTimeout(loading,3000); 
    // },[])
        
    return (
        <>
        <div className='loading-wrapper'>

         <div className='home-loader'>
           <div className='home-rotate'></div>
         <h1>Loading...</h1>
         </div>   
        </div>
        </>
    )
}

export default Loader
