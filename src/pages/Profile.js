import React, { useState, useEffect, useContext } from "react";
import Camera from "../components/svg/Camera";
import Img from "../image1.jpg";
import { storage, db, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc, deleteDoc, } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

import Delete from "../components/svg/Delete";
import { useHistory ,Link} from "react-router-dom";
import { toast} from "react-toastify";
import Edit from "./Edit";
import EditSvg from "../components/svg/EditSvg";
import { AuthContext } from "../context/auth";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const history = useHistory("");

  const {dark} = useContext( AuthContext)

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {

        const imgRef = ref(
          storage,
          `avatars/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          console.log(snap);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
            imges:"added"
          });

          setImg("");
          console.log(url);
          console.log(snap.avatarPath)
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
      console.log(img)
    }




  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        history.replace("/chat");
      }
    } catch (err) {
      console.log(err.message);
    }
  };




  const deleteAccount = async  ()=>{
  
    
    
    try {
      const confirm = window.confirm("want Delete account?");
      if (confirm) {
        const userer = auth.currentUser;
        deleteUser(userer).then(() => {
          toast.success("successfully! Account has been deleted")
        }).catch((error) => {
          toast.error("Error Occur plz logout and login again to delete your account")
        });

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
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
  return user ? (
    <main >

  
    <section  style={ {minWidth:"390px"}} >
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Img } alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
        <div className="edit-box edit-name">
        <Link to="/edit" >Edit Name <EditSvg/> </Link>
        </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
      <div>
        <div className="account-delete-wrapper">
        
        <div className="delete-box">

       <h4>Delete Account</h4>
        <button onClick={deleteAccount} className="btn-sm"> <Delete/> </button>
        </div>
        </div>
      </div>
    </section>
    </main>
  ) : null;
};

export default Profile;
