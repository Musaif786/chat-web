import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import {  useHistory } from "react-router-dom";
import { db } from "../firebase";
// import { deleteUser } from "firebase/auth";

import {
  doc,
  updateDoc,
   deleteField , deleteDoc
} from "firebase/firestore";
import { toast } from "react-toastify";

const Message = ({ msg, user1 , id, msgsid ,chat}) => {
  
  const scrollRef = useRef();
  const history = useHistory("");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log(user1)// To print the user msg
  }, [msg]);

  const onDeleteBackup = async ()=>{
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

      const onDelete = async () => {
        try {
          const confirm = window.confirm(`Do you want to delete this message? ${msg.text} msg id is ${msgsid}`);
          if (confirm) {
            //  Firestore instance and `id` with the specific document ID
            const messageRef = doc(
              db,
              `messages/${id}/chat`,
              msgsid // "mFvEvBgskb4lCs2pmUMf"
            );
      
            await deleteDoc(messageRef); // Deletes the document
            toast("Message deleted successfully");
          }
        } catch (err) {
          console.error("Error deleting message: ", err.message);
        }
      };
      
      // console.log([msgsid])
      // {msgsid.map((m) => (

      //     console.log(m)
      // ))}
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p  onDoubleClick={msg.from === user1 ? onDelete : null} className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img style={{maxHeigt:"200px", maxWidth:"200px"}} src={msg.media} alt={msg.text} /> : null}
        {/* {msg.text} */}
        
        <div className="username">{msg.from !== user1 ? chat.name : "You"}:</div>
        {/* { msg.text.startsWith("http") ? (<a className="msg-link" href={ msg.text } target="_blank">[ link... ]</a>): msg.text } */}
        {msg.text && 
  (msg.text.includes("http") && /\.(com|in|net|org|edu|gov|io|co|uk|app)|(\/)$/.test(msg.text)) ? (
    <a className="msg-link" href={msg.text} target="_blank">
     {msg.text}
    </a>
  ) : (
    msg.text
  )}

        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
          {/* <p>Hello</p> */}
        
          </small>
      </p>
      
    </div>
  );
};

export default Message;
