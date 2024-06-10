import React from "react";


type InputType = "text" | "password" | "number" | "email";

interface InputBoxProps {
    placeholder: string;
    inputType: InputType;
    label: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputBox = ({
    placeholder,
    inputType,
    label,
    handleChange
}: InputBoxProps) => {
  return (
    <div className="flex flex-col my-2 sm:w-[50%] w-[70%]">
        <label className="font-medium">{label}</label>
        <input className="border border-neutral-300 rounded-sm px-4 py-2" type={inputType} placeholder={placeholder} onChange={handleChange}/>
    </div>
  )
}