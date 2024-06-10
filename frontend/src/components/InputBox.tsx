

type InputType = "text" | "password" | "number" | "email";

interface InputBoxProps {
    placeholder: string;
    inputType: InputType;
}

export const InputBox = ({
    placeholder,
    inputType
}: InputBoxProps) => {
  return (
    <div>
        <input type={inputType} placeholder={placeholder}/>
    </div>
  )
}