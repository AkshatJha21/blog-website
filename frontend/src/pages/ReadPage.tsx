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
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setBlog(response.data.blog);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error fetching blog: ' + error);
            setIsLoading(false);
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
        {isLoading ? (
            <ReadPageSkeleton />
        ): (
            <div className="w-[90%] flex flex-col mx-auto my-4">
                <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
                <div className="flex justify-end items-center gap-x-2 mt-2 mb-4">
                    <p className="text-sm font-medium text-neutral-600 mr-2">Written by</p>
                    <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">
                        {blog.author[0]}
                    </div>
                    <p className="font-medium">{blog.author}</p>
                </div>
                <p className="font-serif text-lg">{blog.content}</p>
            </div>
        )}
    </div>
  )
}

const ReadPageSkeleton = () => {
    return (
        <div className="w-[90%] flex flex-col mx-auto my-4 animate-pulse">
            <div className="h-8 bg-neutral-400 rounded mb-2"></div>
            <div className="flex justify-end items-center gap-x-2 mt-2 mb-4">
                <div className="h-6 w-20 bg-neutral-400 rounded"></div>
                <div className="p-2 bg-neutral-400 text-sm rounded-full w-8 h-8 flex items-center justify-center"></div>
                <div className="h-6 w-32 bg-neutral-400 rounded"></div>
            </div>
            <div className="h-4 bg-neutral-400 rounded mb-2"></div>
            <div className="h-4 bg-neutral-400 rounded mb-2"></div>
            <div className="h-4 bg-neutral-400 rounded mb-2"></div>
            <div className="h-4 bg-neutral-400 rounded mb-2"></div>
        </div>
    )
}

export default ReadPage