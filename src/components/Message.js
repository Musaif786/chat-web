import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import { useNavigate, useHistory, useParams, Link } from "react-router-dom";
import { db,auth, storage, } from "../firebase";
import { deleteUser } from "firebase/auth";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
   deleteField 
} from "firebase/firestore";
import { toast } from "react-toastify";

const Message = ({ msg, user1 , id }) => {
  const scrollRef = useRef();
  const history = useHistory("");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const onDelete = async ()=>{
    try {
     const confirm = window.confirm("want Delete account?");
     if(confirm){
  
       const cityRef = doc(db, 'lastMsg',id);
  
       await updateDoc(cityRef, {
        text: deleteField(),
        unread: deleteField(),
    });
   
    toast("successfully deleted");
  
      }
  }catch (err) {
        console.log(err.message);
       }
      };

  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p  onDoubleClick={onDelete} className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img style={{maxHeigt:"200px", maxWidth:"200px"}} src={msg.media} alt={msg.text} /> : null}
        {/* {msg.text} */}
        
        {msg.text && msg.text.charAt(5) == ":" || msg.text.charAt(4) == ":" ? (<a className="msg-link" href={ msg.text } target="_blank">[ link... ]</a>): msg.text }
        
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        
          </small>
      </p>
    </div>
  );
};

export default Message;
