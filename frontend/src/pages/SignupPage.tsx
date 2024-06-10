import { FormButton } from '../components/FormButton'
import FormHeader from '../components/FormHeader'
import { InputBox } from '../components/InputBox'

export const SignupPage = () => {
  return (
    <div>
      <form action="">
        <FormHeader title='Sign Up' subheading='Create an account'/>
        <InputBox inputType={"email"} placeholder='Email'/>
        <InputBox inputType={"text"} placeholder='Name'/>
        <InputBox inputType={"password"} placeholder='Password'/>
        <FormButton text="Sign Up"/>
      </form>
    </div>
  )
}