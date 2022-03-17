import React, {useState,useEffect} from 'react'
import { storage, db, auth } from "../firebase";
import {  doc, updateDoc,setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

const  useGeoLocation =  ()=> {

const [location, setLocation] = useState(false);
const [latitude,setLatitude] = useState("");
const [longitude,setLongitude] = useState("");

const onSuccess = (location)=>{

  setLatitude( location.coords.latitude);
  setLongitude(location.coords.longitude);


   setLocation({
    
     loaded: true,  
     lat: location.coords.latitude,
     lng: location.coords.longitude,
    
   });

};

const onError = (error)=>{
  setLocation({
    error: error.message,
  });
}
  useEffect(()=>{

    

navigator.geolocation.getCurrentPosition(onSuccess,onError);


upDateLocation();
},[longitude,latitude])

const upDateLocation = async ()=>{

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    
    longitude,
    latitude,
    
  });
}
  return location;
}

export default useGeoLocation