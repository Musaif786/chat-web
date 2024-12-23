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
  arrayUnion,
  endAt,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { toast } from "react-toastify";
import Colors from "../components/Colors";
import useGeoLocation from "../components/useGeoLocation";
import "../Css/Home.css";
import Searchuser from "../components/Searchuser";
import { Followusers } from "../components/Followusers";


const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(""); // chat means users data already user there so created with chat name
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [msgsid, setMsgsid] = useState([]);
  const [typings, setTypings] = useState({});
  const [search, setSearch] = useState("");

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search)
  );


  const location = useGeoLocation();

  const user1 = auth.currentUser.uid;
  const date = new Date();

  useEffect(() => {

    // snapshot for to read and update in realtime data
    // Users snapshot listener
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    const unsubscribeUsers = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });

    // // Typing snapshot listener
    // const chatDocRef = doc(db, "users",  auth.currentUser.uid);
    // const unsubscribeTyping = onSnapshot(chatDocRef, (docSnapshot) => {
    //   if (docSnapshot.exists()) {
    //     setTypings(docSnapshot.data()); // Update state with the latest data
    //   }
    // });

    if (text.length >= 1) {
      typing();
    } else {
      nottyping();
    }


    // Cleanup both listeners on unmount
    return () => {
      unsubscribeUsers();
      nottyping();
      // unsubscribeTyping();
    };

    //  monitor changes in `text`
  }, [text]); // Empty dependency array to run once on mount




  // starting typing

  const typing = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isTyping: true,
    });
  };

  const nottyping = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isTyping: false,
    });
  };


  // end typing

  const slidebar = () => {
    let side = document.querySelector(".home_container");
    side.classList.toggle("openbar");
  }
  const hidesearchbutton = () => {
    let side = document.querySelector(".hidesearchbtn");
    side.classList.toggle("unhidesearchbtn");
    // side.classList.toggle("changeiconsearchbtn");

    let side1 = document.querySelector(".searchicon");
    side1.classList.toggle("searchiconhide");

    let side2 = document.querySelector(".expandicon");
    side2.classList.toggle("expandiconunhide");
  }

  const selectUser = async (user) => {
    setChat(user);
    setSearch("")

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
        // console.log(doc.id)
        setMsgsid(doc.id)
      });
      setMsgs(msgs);
      // console.log(doc.id)
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

    if (!text) {
      console.log("invalid msg")
    } else {
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
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        usersid: arrayUnion(id)
      });
    }
    setText("");
    setImg("");
  };
  // console.log(text.length)

  // screen width
  const width = window.innerWidth;
  return (
    <div className="home_container">

      <div className="users_container">
        {/* pahle filteredUsers ke jaga users tha usko replace karke maine filteredUsers likha */}
        {/* {id} */}
        {/* {user1} */}

        {/* left side search box */}
        {chat ?

          <div className="search_togglecls">
            <div className="searchbtniconbox">
              <button title="click to hide search button" id="hidesearchbutton" onClick={hidesearchbutton}>
                <i className="fa fa-expand expandicon" aria-hidden="true"> Hide Search </i>
                <i className="fa fa-search searchicon" aria-hidden="true"> Find Friends</i>

              </button>

              {/* <p className="compressicon"> Expand to find friends</p> */}

            </div>
            <div className="hidesearchbtn">
              <Searchuser handleSearch={handleSearch} search={search} />
            </div>
          </div>
          : null}

        {filteredUsers.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
            setTypings={setTypings}
            typings={typings}
            search={search}
            handleSearch={handleSearch}
          />
        ))}

        {users.map((user) =>
        (<Followusers
          user={user}
          selectUser={selectUser}
          user1={user1}
          chat={chat}

        />))}



      </div>
      <div className="messages_container">


        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
              {/* {width} */}
              {/* sidebar to hide the users list */}
              <button title="click to expand screen" id="openbar" onClick={slidebar}><i class="fa fa-long-arrow-left" aria-hidden="true"></i>
              </button>
              {/* typing added */}
              {/* <p className="typing">{text>2 ? ("typing..."):("")}</p> */}

              <p className="typing">{typings.isTyping ? ("typing...") : null}</p>
              <div>
                <div>
                  <Colors />
                </div>


                <div
                  className={`user_status1 ${chat.isOnline ? "online" : "offline"}`}
                ></div>

                {/* {chat.isOnline ? ("Online") :<Moment format="MMMM Do ">{chat.lastseen}</Moment>} */}

                {/* {chat.isOnline ? ("Online") : chat.lastseen? <Moment fromNow>{chat.lastseen.toDate(new Date())}</Moment> : <Moment fromNow>{chat.createdAt.toDate(new Date())}</Moment> }
            */}
                {chat.isOnline ? ("Online") : chat.lastseen ? <><div className="lastseen"><h6>Last seen</h6> <Moment fromNow className="moment">{chat.lastseen.toDate(new Date())}</Moment> </div> </> : null}


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
                  <Message key={i} msg={msg} user1={user1} id={id} msgsid={msgsid} chat={chat} />
                ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
              chat={chat} //this mean user details
            />
          </>
        ) : (
          <>

            {/* //Main and first search box */}
            <Searchuser handleSearch={handleSearch} search={search} />
            {/* <Followusers user1={user1} users={users} id={id}/> */}
          </>

        )}
      </div>
    </div>
  );
};

export default Home;
