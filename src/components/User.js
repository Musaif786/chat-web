import React, { useEffect, useState } from "react";
import Img from "../image1.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");
  const [typings, setTypings] = useState({});

  useEffect(() => {


        // Typing snapshot listener
    const chatDocRef = doc(db, "users", user2);
    const unsubscribeTyping = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setTypings(docSnapshot.data()); // Update state with the latest data
      }
    });



    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => {unsub();
      unsubscribeTyping();
    };
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
        {/* user details start here */}
          <div className="user_detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">Msg</small>
            )}
            {/* messages seen or not below code */}
            {data && (
          <p className="seen">
            <strong>{typings.isTyping ? ("typing..."):null}</strong>&nbsp;
            <strong>{data.unread === false ? "Seen" : null}</strong>
            
          </p>
        )}
        
            
          </div>
          {/* //user details end here */}
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            
            {data.text}
           
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
      

    </>
  );
};

export default User;
