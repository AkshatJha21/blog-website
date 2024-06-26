import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
  
  interface Blog {
    title: string;
    content: string;
    author: string;
    authorId: string;
  }

const ReadPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog>({title: "", content: "", author: "", authorId: ""});
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
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
            checkFollowingStatus(response.data.blog.authorId, token);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error fetching blog: ' + error);
            setIsLoading(false);
            navigate('/');
        });
    }, []);

    const checkFollowingStatus = async (authorId: string, token: string | null) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/me/following`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const followingList = response.data.users;
            const isFollowing = followingList.some((user: { id: string }) => user.id === authorId);
            setIsFollowing(isFollowing);
        } catch (error) {
            console.error('Error checking following status: ' + error);
        }
    }

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

    const handleMenuClick = async () => {
        const token = localStorage.getItem('token');
        try {
            if (isFollowing) {
                await axios.delete(`${BACKEND_URL}/api/v1/user/me/unfollow/${blog.authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${BACKEND_URL}/api/v1/user/me/follow/${blog.authorId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setIsFollowing(!isFollowing);
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Error unfollowing author: ' + error);
        }
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
                                <div className="p-2 hover:cursor-pointer hover:bg-neutral-100 rounded-md transition">
                                    {isFollowing ? (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            </svg>
                                            Unfollow
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            </svg>
                                            Follow
                                        </div>
                                    )}
                                </div>
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