import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc,datas } from "firebase/firestore";
import Img from "../image1.jpg";

export const Followusers = ({ users, id, user1, user, selectUser, chat, setTypings, typings, search, datas }) => {
  const [usersid, setUsersid] = useState(null);
  // const [data, setData] = useState("");

  useEffect(() => {
    const docRef = doc(db, "users", auth.currentUser.uid);

    // Listen for real-time updates to the document
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data(); // Get the document data
        const usersidArray = userData.usersid || []; // Access the `usersid` array

        // Update the state
        setUsersid(usersidArray);
        // console.log("Usersid Array:", usersidArray);
      } else {
        console.log("No such document!");
      }
    });



    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Render the first user id or null if none */}
      {/* {usersid && usersid[0].includes(user.uid) ? <p>{user.uid}</p> : <p>No usersid found</p>} */}
      {/* {usersid} */}

      {usersid && Array.isArray(usersid) ? (
        usersid.some(id => id.includes(user.uid)) ? (

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
            {datas?.from === user.uid && datas?.unread && (
              <small className="unread">msg</small>
            )}
          
            {/* {data && (
          <p className="seen">
            <strong>{typings.isTyping && data.unread === false? ("typing..."):data.unread === false ? "Seen" : null}</strong>&nbsp;
            
          </p>
        )} */}
        
            
          </div>
          {/* //user details end here */}
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
            </div>

          </>




        ) : (null
          // <p>No usersid found</p> // If user.uid is not found
        )
      ) : (null
        //   <p>No usersid found</p> // If usersid is not an array
      )}





    </div>
  );
};