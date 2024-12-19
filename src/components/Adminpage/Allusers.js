import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../../firebase";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
// import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import User from "../User";
import { toast } from "react-toastify";
// import { deleteUser } from "firebase/auth";

function Allusers() {
  const [users, setUsers] = useState([]);
  const user1 = auth.currentUser.uid;

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

//remove
const deleteAccount = async  () =>{
  
    const delta = auth.currentUser;
    
    try {
      const confirm = window.confirm("want Delete account?");
      if (confirm) {
      // const userer = users.uid;
        delete(delta).then(() => {
          toast.success("successfully! Account has been deleted")
          
        }).catch((error) => {
          toast.error("Error Occur try again")
        });

        await updateDoc(doc(db, "users", users.uid), {
          // name: "Del",
          avatarPath: "",
          isOnline: false,
          delted : "user account is deleted",
          
        });
      }

      
      }catch (err) {
        console.log(err.message);
      }
    

  }

 
  return (
    <>
      <div>
        <div className="users_container">
          <table border="1px" >
            <tr>
            {users.name}
              <th>User names</th>
              <th>User id</th>
              <th>user email</th>
              <th>Created on</th>
             {/* <th>remove</th> */}
              <th> update field</th>
            </tr>
            
            {users.map((user) => (
              <>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.uid}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt.toDate().toDateString()}</td>
                  {/* <td><button  onClick={deleteAccount} className="btn1">Remove</button></td> */}
                  
                  <td>  <Link to={`/two/${user.uid}`}>
                      <button className="btn1">view</button>
                  </Link></td>
                
                </tr>
              </>
            ))}
          </table>
        </div>
      </div>
    </>
  );
}

export default Allusers;
