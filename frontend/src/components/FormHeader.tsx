
interface FormHeaderProps {
    title: string;
    subheading: string;
}

const FormHeader = ({ title, subheading }: FormHeaderProps) => {
  return (
    <div>
        <h2 className='font-bold text-3xl my-2'>{title}</h2>
        <p className="text-neutral-500 text-lg mt-2 mb-4">{subheading}</p>
    </div>
  )
}

export default FormHeader