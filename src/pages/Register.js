import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useHistory , Link } from "react-router-dom";
import "../Css/Register.css";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();

  const { name, email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
        onlineTime:new Date(),
      });
      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/chat");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };


  const signinwithGoogle = async ()=>{
   
    // signInWithPopup(auth , provider);
    try {
      const result = await signInWithPopup(auth , provider);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name:result.user.displayName,
        email:auth.currentUser.email,
        avatar:auth.currentUser.photoURL,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,

        joined: "Through gmail",
      });
      // setData({
      //   name: "",
      //   email: "",
      //   password: "",
      //   error: null,
      //   loading: false,
      // });
      history.replace("/chat");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  
      
  }
  return (
    <section>
      <h3>Create An Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
      </form>
      <div className="login-with-gm-div">
      <button style={{display:"block"}} onClick={signinwithGoogle} className="btn-sm ">Sign-in with Google</button>
        <p>Already have account ?  <Link to="/login">   Login</Link></p>
      </div>
    </section>
  );
};

export default Register;
