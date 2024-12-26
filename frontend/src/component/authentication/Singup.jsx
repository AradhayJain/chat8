import "/src/css/sign.css"
import React, { useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "/src/css/home.css"
// import { ChatState } from "../../provider/ChatProvider";






const Singup = () => {
  const [name, setName] = React.useState()
  const [email, setemail] = React.useState()
  const [password, setpassword] = React.useState()
  const [confirmpassword, setconfirmpassword] = React.useState()
  // const [loading,setLoading]=React.useState(false)
  const [pic,setPic]=React.useState();
  const NavigateTo = useNavigate()



const SubmitHandlerr=async ()=>{
  if(!name || !email || !password || !confirmpassword){
    toast('Please fill all the fields')
    return;
  }
  console.log(name, email, password, pic);
  try{
    const config={
      method:"post",
      headers:{
        "Content-Type":"application/json"
      }
    }
    const {data}=await axios.post("/api/user",{name,email,password,pic},config);
    console.log(data)
    if(data){
      toast('User created successfully')
    }
    
      localStorage.setItem("userInfo",JSON.stringify(data))
      NavigateTo("chats")
  
  }
  catch(err){
    toast("Registration failed")
    return;
  }
    
}

  
const postChange=(event)=>{

  const pics = event.target.files[0];
  if(pics===undefined){
    toast('please help an image')
    return;
  }
  console.log(pics)
  if(pics.type==="image/jpeg" || pics.type==="image/png"){
    const data=new FormData()
    data.append('file',pics)
    data.append('upload_preset','chatApp')
    data.append('cloud_name','dcow3mihl')
    fetch('https://api.cloudinary.com/v1_1/dcow3mihl/image/upload',{
      method:'post',
      body:data
    })
    .then((res)=>res.json())
    .then((data)=>{

      setPic(data.url.toString())
      toast('uploading image')
      console.log(data.url.toString());
    })
    .catch((err)=>{

      console.log(err)
    })
  }else{
    toast('please  an image')

    return;
  }
}
  return (
    
    <div className="form">
      <ToastContainer/>
      <div className="fm">
        <label>Name:
        
          <input className='home-input' onChange={(e)=>setName(e.target.value)} type="text" name="name" placeholder="Enter your name"/>
        </label>
        <br/>
        <label>Email:
          <input className='home-input' onChange={(e)=>setemail(e.target.value)} type="email" name="email" placeholder="Enter your email"/>
        </label>
        <br/>
        <label>Password:
          <input className='home-input' onChange={(e)=>setpassword(e.target.value)} type="password" name="password" placeholder="Enter your password"/>
        </label>
        <br/>
        <label>Confirm Password:
          <input className='home-input' onChange={(e)=>setconfirmpassword(e.target.value)} type="password" name="confirm_password" placeholder="Confirm your password"/>
        </label>

        <br/>
        
        <div className="pic">
          <label>Profile Picture:
            <input className="pic" type="file" name="profilePic" onChange={(e)=>postChange(e)} accept="image/*"/>
          </label>
        </div>
        
        <br/>
        <button onClick={SubmitHandlerr} className="b" type="submit">Signup</button>
      </div>
    </div>
    
   
  )
}

export default Singup