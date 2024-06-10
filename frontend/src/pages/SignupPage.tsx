import { Link } from 'react-router-dom'
import { FormButton } from '../components/FormButton'
import FormHeader from '../components/FormHeader'
import { InputBox } from '../components/InputBox'

export const SignupPage = () => {
  return (
    <div className='h-[100vh] flex items-center'>
      <div className='flex flex-col items-center justify-center md:w-1/2 w-full'>
        <FormHeader title='Create an account' subheading='Sign up to write & explore blogs'/>
        <InputBox inputType={"email"} placeholder='johndoe@email.com' label='Email'/>
        <InputBox inputType={"text"} placeholder='John Doe' label='Name'/>
        <InputBox inputType={"password"} placeholder='Mimimum 8 characters' label='Password'/>
        <FormButton text="Sign Up"/>
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