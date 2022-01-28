import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
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

  return <div  style={dark} className='flexbox'>
      Under construction


      <button className="btn" onClick={handleSignout}>
              Logout
            </button>
  </div>;
}

export default Box;
