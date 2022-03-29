import React, { useEffect, useState } from "react";
import { useNavigate, useHistory, useParams, Link } from "react-router-dom";
import { db, auth, storage, } from "../../firebase";
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

function Two() {

  
  const { id } = useParams();
  const [user, setUser] = useState({});
  const history = useHistory("");

  useEffect(() => {
    getDoc(doc(db, "users", id)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  }, []);

  //delete
const onDelete = async ()=>{
  try {
   const confirm = window.confirm("want Delete account?");
   if(confirm){

     const cityRef = doc(db, 'users', id);

     await updateDoc(cityRef, {
      uid: deleteField(),
      name: deleteField(),
      email: deleteField(),
  });
  history.replace("/allusers");
  toast("successfully deleted");

    }
}catch (err) {
      console.log(err.message);
     }
    };

  return (
    <>
      <div style={{ marginTop: "100px", margin: "100px 20px" }}>
        <div className="">
          <div className="">
            <p>user contact details</p>
          </div>
          <div className="">
            <strong>ID:</strong>
            <span>{id}</span>
            <br />
            <br />
            <strong>Name:</strong>
            <span>{user.name}</span>
            <br />
            <br />
            <strong>Email:</strong>
            <span>{user.email}</span>

            <br />
            <br />
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Two;
