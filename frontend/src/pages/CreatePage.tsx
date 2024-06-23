import { useEffect, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { BlogCreate } from "@akshatjha21/medium-common";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [blogInputs, setBlogInputs] = useState<BlogCreate>({
        title: "",
        content: ""
    });

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handlePublish = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/v1/blog`, blogInputs, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error("Error publishing the blog: " + error);
        }
    };

    const isNotFilled = !blogInputs.title || !blogInputs.content || !blogInputs.content.trim() || !blogInputs.title.trim();

  return (
    <div>
        <Navbar 
            primaryBtn="Publish" 
            showPlus={false} 
            primaryClick={() => handlePublish()}
            publishedDisabled={isNotFilled}
        />
        <div className="flex flex-col w-[90%] mx-auto justify-start my-4 p-4">
            <input 
                ref={inputRef} 
                className="text-2xl font-bold mb-4 p-1 focus:outline-none" 
                type="text" 
                placeholder="Enter a title"
                onChange={(e) => {
                    setBlogInputs(c => ({
                        ...c,
                        title: e.target.value
                    }))
                }}
            />
            <textarea 
                rows={20} 
                className="focus:outline-none resize-none p-1 text-lg mt-4 font-serif" 
                placeholder="Write your blog here"
                onChange={(e) => {
                    setBlogInputs(c => ({
                        ...c,
                        content: e.target.value
                    }))
                }}
            />
        </div>
    </div>
  )
}

export default CreatePage