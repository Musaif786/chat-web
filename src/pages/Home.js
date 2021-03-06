import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import Moment from "react-moment";
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
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { toast } from "react-toastify";
import Colors from "../components/Colors";
import useGeoLocation from "../components/useGeoLocation";


const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const location = useGeoLocation();

  const user1 = auth.currentUser.uid;
  const date = new Date();

  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();

     
  }, []);

  const slidebar = ()=>{
    let side = document.querySelector(".home_container");
      side.classList.toggle("openbar");
 }


  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };
//saving to message 
  const user2 = chat.uid;

  const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
 //
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    if(!text){
      console.log("invalid msg")
    }else{
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
  }
    setText("");
    setImg("");
  };

  // screen width
 const width =window.innerWidth ;
  return (
    <div className="home_container">
    
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
              {/* {width} */}
              {/* sidebar to hide the users list */}
              <button title="double tap to hide users list" id="openbar" onClick={slidebar}><i class="fa fa-long-arrow-left" aria-hidden="true"></i>
</button>
              {/* typing added */}
              {/* <p className="typing">{text>2 ? ("typing..."):("")}</p> */}

              <p className="typing">{text<2 ? (""):("typing...")}</p>
              <div> 
              <div>
                <Colors/>
              </div>
              

          <div
            className={`user_status1 ${chat.isOnline ? "online" : "offline"}`}
          ></div>

           {chat.isOnline ? ("Online") :<Moment format='MMMM Do YYYY,'>{date}</Moment>}
         

            
          {/* <div>
          i tried to create a online and offline time but not possible not working
          <Moment fromNow>{chat.createdAt.toDate(new Date())}</Moment>

          </div> */}
          {/* <Moment fromNow={chat.createdAt.toDate()}></Moment> */}
        
        </div>
            </div>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} id={id} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start the conversation</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
