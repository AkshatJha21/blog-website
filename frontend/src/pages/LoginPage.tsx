import { FormButton } from '../components/FormButton'
import FormHeader from '../components/FormHeader'
import { InputBox } from '../components/InputBox'

export const LoginPage = () => {
  return (
    <div>
        <form action="">
        <FormHeader title='Login' subheading='Sing into your account'/>
        <InputBox inputType={"email"} placeholder='Email'/>
        <InputBox inputType={"password"} placeholder='Password'/>
        <FormButton text="Login"/>
      </form>
    </div>
  )
}