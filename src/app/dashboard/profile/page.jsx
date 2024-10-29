'use client'

// import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Headers from '../header/Headers';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FiYoutube } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import Cookies from 'js-cookie';

import axios from 'axios';
import '../dashboard.css';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const page = () => {
    const nav = useRouter()
    
    const [getAdminData,SetAdminData]=useState({})
    const [hideinputs,showinputs]=useState(false)
    const [btntext,setbtntext]=useState("Send OTP")
    const [ imgPres, setImgPres ] = useState({});

 

    const AdminData =()=>{
        const cookiedata= JSON.parse(Cookies.get("frankandoak-login"))
        // console.log(cookiedata)
        if(cookiedata){
            SetAdminData(cookiedata[0])
            
        }
        // console.log(getAdminData)
        // setAdminData(cookiedata)
    }

    const handelUpdateprofile = async(e)=>{
        e.preventDefault();
        
        // const datas={
        //     name:e.target.name.value,
        //     fb:e.target.facebook.value,
        //     insta:e.target.insta.value,
        //     youtube:e.target.youtube.value,
        //     twitter:e.target.youtube.value,
        //     logo:e.target.logo.value,
        //     favicon:e.target.favicon.value,
        //     footer_icon:e.target.footer_icon.value,
        //     password:e.target.password.value
        // }
        // console.log(datas)
        const datas=e.target
        try{
           if( !window.confirm("Do you want to update this Profile"))return
            let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/admin-panel/admin/update-admin/${getAdminData._id}`,datas)
            // console.log(datas,response)
            if(response.status!==200)return(
                swal({
                    title:"Something Went Wrong !! ",
                    text:"Please Try After Sometime !!",
                    icon:"warning",
            }))
            swal({
                title:"SUCCESS !! ",
                text:"Data has been Successfully Updated",
                icon:"success",
            })
            
            Cookies.remove("frankandoak-login")
            nav.push("/login-admin")
        }
        catch(error){
            console.log(error)
            swal({
                title:"Something Went Wrong !! ",
                text:"Something Went Wrong in Server !!",
                icon:"error",
           })
        }
    }

    const handlegenerateotp = ()=>{
        showinputs(!hideinputs)
        let otptimer=60
        setbtntext(`REGENERATE OTP IN ${otptimer}`)    
        const timerInterval = setInterval(()=>{
            otptimer--
            setbtntext(`REGENERATE OTP IN ${otptimer}'s`)
            if(otptimer===0){
                clearInterval(timerInterval)
                showinputs(false)
                setbtntext("Send OTP")
            }
        },1000)   
        
        try{
            const response = axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/admin-panel/admin/genrate-otp`,getAdminData);
            // alert("")
            toast("otp is sent");

        }
        catch(error){
            console.log(error)
            swal({
                title:"Something went wrong in server !!",
                text:"Please try again",
                icon:"error"
            })
        }
    }

    const updateemail=(e)=>{
        e.preventDefault();
        const newvalues = {
            email:e.target.email.value,
            userotp:e.target.otp.value,
            newemail:e.target.newemail.value
        }
        // console.log(e.target.otp.value)
        // console.log(newvalues,getAdminData._id)
        try{
            if( !window.confirm("Do you want to update this email"))return
            
            const response = axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/admin-panel/admin/update-email/${getAdminData._id}`,newvalues)
            swal({
                title:"SUCCESS ",
                text:"Email has been successfully updated !!",
                icon:"success"
            })
            Cookies.remove("frankandoak-login")
            nav.push("/login-admin")
        }
        catch(error){
            console.log(error)
            swal({
                title:"Something went wrong in server !!",
                text:"Please try again",
                icon:"error"
            })
        }
    }

    const handleFileSelect = (e)=>{
        const fieldname = e.target.name;

          const reader = new FileReader();
            
          const file = e.target.files[0];
      
          if(file){
            reader.readAsDataURL(file);
          }
      
          reader.onload = ()=>{
            // setImgPres({...imgPres,fieldname: reader.result })
            
            setImgPres((prevState)=>({...prevState, [fieldname]:reader.result}));
            // SetAdminData((prevState)=>({...prevState, [fieldname]:reader.result}));
          }
    
      };
    //   console.log(getAdminData,"admin",imgPres)

    useEffect(()=>{
        AdminData()
    },[])
    // console.log("GET",getAdminData)

  return (
    <div>
            <Headers/>
            <div className=''>
                <div className='p-2 border-top border-bottom border-end'>
                    <ul className=' list-unstyled d-flex gap-2 mx-3'>
                        <Link className='text-decoration-none' href='/dashboard' ><li className='text-info'>Home</li></Link>
                        <li>/</li>
                        <li>Profile</li>
                        
                    </ul>
                </div>
                <form onSubmit={handelUpdateprofile} method='post'>
                <Container>
                <div className='border-start border-end border-bottom my-4 rounded-top'>
                    <div className='bgg fw-bold fs-3 py-2 px-3'>
                        Profile    
                    </div>    
                    <div className='d-flex'>
                    <div className='container w-50 p-3'>
                        <label className='my-2'>
                            Name
                        </label>
                        <input placeholder='Name' name='name' 
                        value={getAdminData.name}
                        onChange={(e)=>{SetAdminData({...getAdminData,name:e.target.value})}}
                        className='d-block w-100 rounded inn p-1 my-2' type='text'/>

                        <label className='d-block my-3'>
                            Social Links
                        </label>
                        <div className='my-4'>
                        <IconContext.Provider value={{size:'24px' ,color:'white'}}>
                        <lable className='w-25 me-4'>
                            
                        <FaFacebookF />
                        </lable>
                        </IconContext.Provider>
                        <input className=' w-75 rounded inn p-1 mb-2' name='facebook' 
                        value={getAdminData.facebook}
                        onChange={(e)=>{SetAdminData({...getAdminData,facebook:e.target.value})}}
                        type='text'/>
                        </div>

                        <div className='my-4'>
                            <IconContext.Provider value={{size:'24px',color:'white'}}>
                        <lable className='w-25 me-4'>
                        <BsInstagram />
                        </lable>
                        </IconContext.Provider>
                        <input className=' w-75 rounded inn p-1 mb-2' name='insta' 
                        value={getAdminData.insta}
                        onChange={(e)=>{SetAdminData({...getAdminData,insta:e.target.value})}}
                        type='text'/>
                        </div>

                        <div className='my-4'>
                            <IconContext.Provider value={{size:'24px',color:'white'}}>
                        <lable className='w-25 me-4'>
                        <FiYoutube />
                        </lable>
                        </IconContext.Provider>
                        <input className=' w-75 rounded inn p-1 mb-2' name='youtube' 
                        value={getAdminData.youtube}

                        onChange={(e)=>{SetAdminData({...getAdminData,youtube:e.target.value})}}
                        type='text'/>
                        </div>

                        <div className='my-4'>
                            <IconContext.Provider value={{size:'24px' , color:'white'}}>
                        <lable className='w-25 me-4'>
                        <BsTwitterX />
                        </lable>
                        </IconContext.Provider>
                        <input className=' w-75 rounded inn p-1 mb-2' name='twitter'
                        value={getAdminData.twitter}
                        onChange={(e)=>{SetAdminData({...getAdminData,twitter:e.target.value})}}
                        type='text'/>
                        </div>

                        <div>
                        <div className='my-4'>Logo</div>
                        <div className='my-4'>
                            <img src={imgPres.logo || `http://localhost:5200/frankandoak-files/admin/${getAdminData.logo}`} width='50px' height='50px'/>
                        </div>
                        <input  className='d-block w-100 rounded inn p-1 my-2' name='logo' onChange={handleFileSelect} type='file'/>

                        <div className='my-4'>Sub Logo</div>
                        <div className='my-4'>
                            <img src={imgPres.favicon ||  `http://localhost:5200/frankandoak-files/admin/${getAdminData.favicon}`} width='50px' height='50px' />
                        </div>
                        <input  className='d-block w-100 rounded inn p-1 my-2' name='favicon' onChange={handleFileSelect} type='file'/>

                        <div className='my-4'>Footer Logo</div>
                        <div className='my-4'>
                            <img src={imgPres.footer_icon || `http://localhost:5200/frankandoak-files/admin/${getAdminData.footer_icon}`} width='50px' height='50px' />
                        </div>
                        <input  className='d-block w-100 rounded inn p-1 my-2' name='footer_icon' onChange={handleFileSelect} type='file'/>
                        </div>

                        
                    </div>
                    <div className='w-50 d-flex position-relative justify-content-center my-5'>
                        <div className=''>
                            <input type='file' name='profile'  onChange={handleFileSelect} className={`profile ${(imgPres.profile || getAdminData.profile)?'':''} `}/>
                            <img src={imgPres.profile || `http://localhost:5200/frankandoak-files/admin/${getAdminData.profile}`} className='border zindex rounded-circle' width="150" height="150" alt='profile picture' />

                            <lable className='my-4 d-block ms-5'>Profile Picture</lable>
                        </div>
                    </div>
                    </div>
                    <div className='container'>
                    <label className='my-2'>
                            Password
                        </label>
                        
                        <input placeholder='password' name='password' 
                        value={getAdminData.password}
                        onChange={(e)=>{SetAdminData({...getAdminData,password:e.target.value})}}
                        className='d-block w-100 rounded inn p-1 my-2' type='password'/>

                        <button type='submit' className='bg-primary my-3 p-2 px-3 rounded border-0 text-white'> Update </button>
                    </div>
                </div>
                </Container>
                </form>

                <form onSubmit={updateemail} method='post'>
                <Container>
                <div className='border-start border-end border-bottom my-4 rounded-top'>
                    <div className='bgg fw-bold fs-3 py-2 px-3'>
                        Email Authentication    
                    </div>    
                    <div className='container p-3'>
                        <label className='my-2'>
                           Old Email
                        </label>
                        <input placeholder='Current Email'
                        value={getAdminData.email}
                        name='email'
                        onChange={(e)=>{SetAdminData({...getAdminData,email:e.target.value})}}
                        className='d-block w-100 rounded inn p-1 my-2' type='email' />

                        {
                            hideinputs==true?
                            <><label className='my-2'>
                        OTP
                    </label>
                    <input placeholder='Enter your OTP'
                    name='otp'
                    className='d-block w-100 rounded inn p-1 my-2'  type='text'/>

                    <label className='my-2'>
                       New Email
                    </label>
                    <input placeholder='New Email' className='d-block w-100 rounded inn p-1 my-2' name='newemail' type='email' />

                    <button className='my-3 p-2 rounded border-0 bg-secondary text-white' disabled >{btntext}</button>
                    <button  type='submit' className='my-3 mx-5 p-2 rounded border-0 bg-primary text-white'  >Update Email</button>
                    </>
                    
                    :
                    
                    <button type='button' className='my-3 p-2 rounded border-0 bg-primary text-white' onClick={handlegenerateotp} >{btntext}
                    <ToastContainer />
                    </button>
                        }

                        
                    </div>
                </div>
                </Container>
                </form>
            </div>
     </div>
  )
}

export default page