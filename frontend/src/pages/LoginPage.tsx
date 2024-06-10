import { Link, useNavigate } from 'react-router-dom'
import { FormButton } from '../components/FormButton'
import FormHeader from '../components/FormHeader'
import { InputBox } from '../components/InputBox'
import { useState } from 'react'
import { LoginInput } from '@akshatjha21/medium-common'
import axios from 'axios'
import { BACKEND_URL } from '../config'

export const LoginPage = () => {

  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<LoginInput>({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInputs);
      localStorage.setItem("token", response.data.jwt);
      navigate('/blog');
      console.log("log in success");
      
    } catch (error) {
      console.error("Failed to login: ", error);
    }
  };
  
  return (
    <div className='h-[100vh] flex items-center'>
      <div className='flex flex-col items-center justify-center md:w-1/2 w-full'>
        <FormHeader title='Welcome back' subheading='Login to continue blogging'/>
        <InputBox inputType={"email"} placeholder='johndoe@email.com' label='Email' handleChange={(e) => {
          setPostInputs(c => ({
            ...c,
            email: e.target.value
          }))
        }}/>
        <InputBox inputType={"password"} placeholder='Enter password' label='Password' handleChange={(e) => {
          setPostInputs(c => ({
            ...c,
            password: e.target.value
          }))
        }}/>
        <FormButton text="Login" handleClick={handleLogin}/>
        <p className='text-neutral-500 my-4'>New here?&nbsp; 
          <Link to={'/signup'}>
            <u>Sign Up</u>
          </Link>
        </p>
      </div>
      <div className='hidden w-1/2 md:flex flex-col justify-center bg-neutral-100 h-full px-12'>
        <h2 className='font-bold text-3xl my-2'>"Fast, clean and free. This is the best blogging website on the internet."</h2>
        <p className='my-2 font-medium text-lg'>~ Michael DeSanta</p>
        <p className='text-neutral-500 text-sm'>Writer from Los Angeles, California</p>
      </div>
    </div>
  )
}