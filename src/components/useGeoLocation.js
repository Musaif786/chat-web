import React, {useState,useEffect} from 'react'
import { storage, db, auth } from "../firebase";
import {  doc, updateDoc,setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

const  useGeoLocation =  ()=> {

const [location, setLocation] = useState({
  loaded: false,
  cordinates: {lat:"", long:""}
});
const [latitude,setLatitude] = useState("");
const [longitude,setLongitude] = useState("");


 const googleMap = `https://www.google.com/maps/@${latitude},${longitude}`
 
const onSuccess = (location)=>{

  setLatitude( location.coords.latitude);
  setLongitude(location.coords.longitude);

console.log(location)
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
      console.log("Not Available geoloctn");

    }


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