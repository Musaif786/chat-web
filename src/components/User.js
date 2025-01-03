import React, { useEffect, useState } from "react";
import Img from "../image1.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const User = ({ user1, user,data,setData, selectUser, chat ,setTypings,typings,search}) => {
  const user2 = user?.uid;
  // const [data, setData] = useState("");
  // const [typings, setTypings] = useState({});
  // console.log(`Main user ${user2}`)
  useEffect(() => {


        // Typing snapshot listener
    const chatDocRef = doc(db, "users", user?.uid);
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
     
     { search ? <>
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
              <small className="unread">msg</small>
            )}
            {/* messages seen or not below code */}
            {data && (
          <p className="seen">
            <strong>{typings.isTyping && data.unread === false? ("typing..."):data.unread === false ? "Seen" : null}</strong>&nbsp;
            
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
    : null}
    </>
  );
};

export default User;
