
interface FormButtonProps {
    text: string;
}

export const FormButton = ({
    text
}: FormButtonProps) => {
  return (
    <div>
        <button>{text}</button>
    </div>
  )
}