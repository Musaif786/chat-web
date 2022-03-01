import React, { useEffect, useState } from 'react';
import { useParams ,useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { auth , db} from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';


function Edit() {
    const [data, setData]= useState([]);
    const [load, setLoad] = useState(false);
    const [ newname, setNewname]= useState();

    const history = useHistory();

    const { uid } = useParams();
    const id = auth.currentUser.uid
    useEffect(()=>{
        if(id){

    const  gettingdata =async ()=>{     


        const docRef = doc(db, "users", id);
const docSnap = await getDoc(docRef);


if (docSnap.exists()) {
    setData(docSnap.data());
} else {
  // doc.data() will be undefined in this case
  toast.error("No such document!");
}
  }

 gettingdata();
 console.log(data)
    }
  
    
    
},[])
const updateName = async (e)=>{
    e.preventDefault();
    if(newname){

    if( newname=="admin" | newname=="Admin" | newname=="musaif" | newname=="princess"){
      toast("Name already taken")
    }else{
    await updateDoc(doc(db, "users", auth.currentUser.uid,), {
        name: newname,
      }).then( done =>{

          toast.success("Name has been updated successfully");
          //history
          setTimeout(()=> history.replace("/profile"),1500);

      })}
    }else{
        toast.error("Empty name not valid")
    }

}
return  <div>
          
          <section>
      <h3>Edit your name</h3>
      <form className="form" >
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" placeholder={data.name} value={newname} onChange={(e)=>{setNewname(e.target.value)}} />
        </div>
        <button style={{marginTop:"10px"}} onClick={updateName} className="btn" disabled={data.loading}>
            { data.loading ? "Updating name ..." : "update" }
          </button>
        
        {/* {error ? <p className="error">{error}</p> : null} */}
        {/* <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Creating ..." : "Register"}
          </button>
        </div> */}
      </form>
      
    </section>
  
  </div>;
}

export default Edit;
