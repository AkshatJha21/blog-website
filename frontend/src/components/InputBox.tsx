

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
        <input className="border-2 border-neutral-300 rounded-sm" type={inputType} placeholder={placeholder}/>
    </div>
  )
}