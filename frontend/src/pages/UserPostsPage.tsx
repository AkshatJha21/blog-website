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

    const handleEdit = () => {
        if (selectedPost) {
            navigate(`/edit/${selectedPost}`);
        }
    }

    const handleDelete = async () => {
        if (selectedPost) {
            const token = localStorage.getItem('token');

            try {
                await axios.delete(`${BACKEND_URL}/api/v1/blog/delete`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        id: selectedPost.toString()
                    }
                });
                
                setPosts(posts.filter(post => post.id !== selectedPost));
                setIsMenuOpen(false);
            } catch (error) {
                console.error("Error deleting blog: " + error);
            }
        }
    }

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
                        <div key={post.id} className="w-[70%] lg:w-[60%] mx-auto justify-between flex py-2 px-4 border-b relative">
                            <div>
                                <h2 className="font-bold text-xl my-2">{post.title}</h2>
                                <p className="font-serif">{truncateString(post.content, 150)}</p>
                            </div>
                            <button className="hover:bg-neutral-100 transition rounded-full h-6 w-6 my-auto" onClick={() => handleButtonClick(post.id)}>
                                <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                                </svg>
                            </button>
                            {isMenuOpen && selectedPost === post.id && (
                                <div ref={menuRef} onClick={handleMenuClick} className="w-40 absolute right-0 top-12 z-10 bg-white shadow-md p-1 border rounded-md">
                                    <div onClick={handleEdit} className="p-2 cursor-pointer hover:bg-neutral-100 rounded flex items-center transition">
                                        <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                                        </svg>
                                        Edit
                                    </div>
                                    <div onClick={handleDelete} className="p-2 cursor-pointer hover:bg-neutral-100 rounded flex items-center transition">
                                        <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                        </svg>
                                        Delete
                                    </div>
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
