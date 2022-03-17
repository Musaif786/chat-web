import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";
import Darkmodebtn from "./Darkmodebtn";

const Navbar = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace("/");
  };
  return (
    <nav >
      <h3>
      {user ? (
        <Link to="/chat">Chat <i class="fa fa-comments-o" aria-hidden="true"></i>
</Link>) : (
  <Link to="/">Musaif </Link>
)
      }

      </h3>
      <div>
        {user ? (
          <>
          <Darkmodebtn/>
          <Link to="/box">Snap</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleSignout}>
              Logout
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
