import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { updateDoc ,setDoc, doc, Timestamp} from "firebase/firestore";
import { useHistory, Link } from "react-router-dom";


const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
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
        lastseen: Timestamp.fromDate(new Date()),

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
    } }

  return (
    <section>
      <h3>Log into your Account</h3>
      <form className="form" onSubmit={handleSubmit}>
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
            {loading ? "Logging in ..." : "Login"}
          </button>
        </div>
      </form>
      <div className="login-with-gm-div">
      <p>Forgot password ?  <Link to="/reset">Reset</Link> </p>
        <p>Don't have an account ?  <Link to="/register">   Create</Link></p>
        <button style={{display:"block", marginTop:"5px"}} onClick={signinwithGoogle} className="btn-sm ">Login With Google</button>
      </div>
    </section>
  );
};

export default Login;
