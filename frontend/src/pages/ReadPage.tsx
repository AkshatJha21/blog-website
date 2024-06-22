import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useRef, useState } from "react";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
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

    const handleButtonClick = () => {
        setIsMenuOpen(p => !p);
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false);
        }
    }

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isMenuOpen]);

    const handleMenuClick = () => {
        setIsMenuOpen(false);
    }

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
            <div className="w-[90%] flex flex-col mx-auto my-4 relative">
                <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
                <div className="flex justify-end items-center gap-x-2 mt-2 mb-4 relative">
                    <p className="text-sm font-medium text-neutral-600">Written by</p>
                    <div onClick={handleButtonClick} className="flex justify-end items-center gap-x-2 p-1 hover:bg-neutral-100 rounded-full hover:cursor-pointer transition">
                        <div className="p-2 bg-neutral-200 text-sm rounded-full w-8 h-8 flex items-center justify-center">
                            {blog.author[0]}
                        </div>
                        <p className="font-medium">{blog.author}</p>
                    </div>
                        {isMenuOpen && (
                            <div ref={menuRef} onClick={handleMenuClick} className="w-40 absolute top-full z-10 bg-white shadow-md p-1 border rounded-md">
                                <div className="p-2 hover:cursor-pointer hover:bg-neutral-100 rounded-md">Follow Author</div>
                            </div>
                        )}
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