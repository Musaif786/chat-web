import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);


  // darkmode

  const [dark, setDark] = useState({
    color:"white",
    backgroundColor:"#242527",
    transition:"0.5s",
})


const togglebtn = ()=>{
  console.log("hii im trigger")

if(dark.backgroundColor == "#242527"){
    setDark({
        color:"black",
        backgroundColor:"white",
        transition:"0.5s",
        border:"1px solid black",


    })
}else{
    setDark({
        color:"white",
        backgroundColor:"#242527",
        transition:"0.5s",
        

    });
}
}




  
  //api usecontext
  const value = { user , togglebtn, dark};



  if (loading) {
    return <Loading />;
  }
  return (
    <AuthContext.Provider value={value }>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
