import React, { useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import Darkmodebtn from "./Darkmodebtn";
import "../Css/Admin/Admin.css";

const Navbar = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  
   //const names = auth.currentUser.email;

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace("/");
  };
  //admin info
   const Adminui = ()=>{
     let ul = document.querySelector(".admin-u1");
       ul.classList.toggle("admin-panel");
     
   }
   
  return (
    <nav >
    
      <h3>
      {user ? (
        <>

        <Link to="/chat">Chat <i class="fa fa-comments-o" aria-hidden="true"></i>
</Link>

        </>

) : (
  <Link to="/">Musaif </Link>
  
)
      }

      </h3>
      <div>
      
        {user ? (
          <>
          {user.email == "mdmusaif.mm@gmail.com" || user.email == "sss@mail.com" ? (<>
              
              <ul className="admin">
              <li onClick={Adminui} className="adminhidebtn">Admin</li>
               <li>
                 <ul className="admin-u1">
                    <li><Link to="/allusers">Admin page</Link></li>
                   <li>two</li>
                   <li> three</li>
                 </ul>
               </li>
              </ul>
             </>):(<Darkmodebtn/>)}
          {/* <Darkmodebtn/> */}
          <Link to="/box">Snap</Link>
            <Link to="/profile">Profile</Link>
            
            <button className="btn" onClick={handleSignout}><i class="fa fa-sign-out" aria-hidden="true"></i>
</button>
           
          </>
        ) : (
          <>
          <Darkmodebtn/>
           
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            
      
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


/*
 {names == "mdmusaif.mm@mail.com" || names == "sss@mail.com" ? (<>
              <Link to="/profile">Admin page</Link>
             </>):null}
*/