import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import NoResult from "../components/NoResult";
import { BACKEND_URL } from "../config";

interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

const UserPostsPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    
    const handlePrevious = () => {
        setPage(page => page - 1);
    }
  
    const handleNext = () => {
        setPage(page => page + 1);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            setLoading(true);

            try {

                const postsResponse = await axios.get(`${BACKEND_URL}/api/v1/blog/my-posts?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(postsResponse.data.blogs);
                setTotal(postsResponse.data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user details or posts: " + error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const truncateString = (str: string, num: number) => {
        if (str.length <= num) {
          return str;
        }
        return str.slice(0, num) + "...";
    };

    const handleButtonClick = (postId: string) => {
        setSelectedPost(postId);
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
    };

    return (
        <div>
            <Navbar 
                primaryBtn="New" 
                showPlus={true} 
                primaryClick={() => navigate('/create')}
            />
            <div className="flex flex-col mx-auto h-[100vh]">
                {loading ? (
                    <Loader />
                ) : posts.length === 0 ? (
                    <NoResult />
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="w-[70%] lg:w-[40%] mx-auto justify-between flex py-2 px-4 border-b relative">
                            <div>
                                <h2 className="font-bold text-xl my-2">{post.title}</h2>
                                <p className="font-serif">{truncateString(post.content, 150)}</p>
                            </div>
                            <button className="hover:bg-neutral-100 transition rounded-full h-6 w-6 my-auto" onClick={() => handleButtonClick(post.id)}>
                                <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                                </svg>
                            </button>
                            {isMenuOpen && selectedPost === post.id && (
                                <div ref={menuRef} onClick={handleMenuClick} className="w-40 absolute right-0 top-12 z-10 bg-white shadow-md p-1 border rounded-md">
                                    <div className="p-2 cursor-pointer hover:bg-neutral-100 rounded">Edit</div>
                                    <div className="p-2 cursor-pointer hover:bg-neutral-100 rounded">Delete</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="flex mx-auto mt-2 text-sm border-2 rounded-sm fixed bottom-2 right-2 bg-white">
          <button 
            className="p-2 disabled:text-neutral-300 flex items-center border-r" 
            disabled={page === 1} 
            onClick={handlePrevious}
          >
            <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 8-4 4 4 4"/>
            </svg>
          </button>
          <button 
          className="p-2 disabled:text-neutral-300 flex items-center border-r" 
          disabled={page === total} 
          onClick={handleNext}
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4"/>
            </svg>
          </button>
        </div>
        </div>
    );
};

export default UserPostsPage;
