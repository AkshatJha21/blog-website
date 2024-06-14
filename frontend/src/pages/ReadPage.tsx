import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
  
  interface Blog {
    title: string;
    content: string;
    author: string;
  }

const ReadPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog>({title: "", content: "", author: ""});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setBlog(response.data.blog);
        }).catch(error => {
            console.error('Error fetching blog: ' + error);
            navigate('/');
        });
    }, []);

  return (
    <div>
        <Navbar 
            primaryBtn="New" 
            showPlus={true} 
            primaryClick={() => navigate('/create')}
        />
        <div className="w-[90%] flex flex-col mx-auto my-4">
            <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
            <div className="flex justify-end items-center gap-x-2 my-2">
                <p>Written by</p>
                <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">
                    {blog.author[0]}
                </div>
                <p className="font-medium">{blog.author}</p>
            </div>
            <p className="font-serif text-lg">{blog.content}</p>
        </div>
    </div>
  )
}

export default ReadPage