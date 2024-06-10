import React from 'react'

interface FormHeaderProps {
    title: string;
    subheading: string;
}

const FormHeader = ({ title, subheading }: FormHeaderProps) => {
  return (
    <div>
        <h2>{title}</h2>
        <p>{subheading}</p>
    </div>
  )
}

export default FormHeader