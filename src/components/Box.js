import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import Video from "./Video";
import useGeoLocation from "./useGeoLocation";
function Box() {
  const history = useHistory();


  const { dark } = useContext( AuthContext)

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace("/login");
  };

  //location access from location js

  const location = useGeoLocation();

  return <>

   {/* <div  style={dark} className='flexbox'>
      Under construction


      <button className="btn" onClick={handleSignout}>
              Logout
            </button>
  </div>; */}


  <div>
    <Video/>
     {/* <useGeoLocation/> */}
  </div>
   <div>
    {
      (location.loaded) ? JSON.stringify(location) : "user denied location access "
    }
  </div> 
  </>
}

export default Box;
