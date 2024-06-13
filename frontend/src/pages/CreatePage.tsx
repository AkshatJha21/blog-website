import { useEffect, useRef } from "react"
import Navbar from "../components/Navbar"

const CreatePage = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    
  return (
    <div>
        <Navbar 
            heading="TheBlog" 
            primaryBtn="Publish" 
            showPlus={false} 
            secondaryBtn="U" 
            primaryClick={() => {}}
            secondaryClick={() => {}}
        />
        <div className="flex flex-col w-[90%] mx-auto justify-start my-4 p-4">
            <input ref={inputRef} className="text-2xl font-bold mb-4 p-1 focus:outline-none" type="text" placeholder="Enter a title"/>
            <textarea rows={20} className="focus:outline-none resize-none p-1 text-lg mt-4 font-serif" placeholder="Write your blog here"/>
        </div>
    </div>
  )
}

export default CreatePage