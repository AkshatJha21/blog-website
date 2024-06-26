
interface FormButtonProps {
    text: string;
    handleClick: () => void;
}

export const FormButton = ({
    text,
    handleClick
}: FormButtonProps) => {
  return (
    <div className="my-4 sm:w-[50%] w-[70%]">
        <button onClick={handleClick} className="bg-black text-white w-full py-2 rounded-sm font-medium hover:opacity-75 transition-opacity duration-200">{text}</button>
    </div>
  )
}