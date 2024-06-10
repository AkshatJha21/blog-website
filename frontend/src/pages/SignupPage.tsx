import { Link } from 'react-router-dom'
import { FormButton } from '../components/FormButton'
import FormHeader from '../components/FormHeader'
import { InputBox } from '../components/InputBox'
import { useState } from 'react'
import { SignupInput } from '@akshatjha21/medium-common'
import axios from 'axios'

export const SignupPage = () => {

  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = async () => {
    await axios.post("http://localhost")
  };

  return (
    <div className='h-[100vh] flex items-center'>
      <div className='flex flex-col items-center justify-center md:w-1/2 w-full'>
        <FormHeader title='Create an account' subheading='Sign up to write & explore blogs'/>
        <InputBox inputType={"email"} placeholder='johndoe@email.com' label='Email' handleChange={(e) => {
          setPostInputs(c => ({
            ...c,
            email: e.target.value
          }))
        }}/>
        <InputBox inputType={"text"} placeholder='John Doe' label='Name' handleChange={(e) => {
          setPostInputs(c => ({
            ...c,
            name: e.target.value
          }))
        }}/>
        <InputBox inputType={"password"} placeholder='Mimimum 8 characters' label='Password' handleChange={(e) => {
          setPostInputs(c => ({
            ...c,
            password: e.target.value
          }))
        }}/>
        <FormButton text="Sign Up" handleClick={() => {}}/>
        <p className='text-neutral-500 my-4'>Already a user?&nbsp; 
          <Link to={'/login'}>
            <u>Login</u>
          </Link>
        </p>
      </div>
      <div className='hidden w-1/2 md:flex flex-col justify-center bg-neutral-100 h-full px-12'>
        <h2 className='font-bold text-3xl my-2'>"I love how easy it is to write and publish posts. I can publish new blogs within seconds."</h2>
        <p className='my-2 font-medium text-lg'>~ Chris Williamson</p>
        <p className='text-neutral-500 text-sm'>Author from Austin, Texas</p>
      </div>
    </div>
  )
}