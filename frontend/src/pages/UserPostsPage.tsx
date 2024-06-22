import { useEffect, useState } from "react";
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

interface User {
    id: string;
    email: string;
    name: string;
}

const UserPostsPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    
    const handlePrevious = () => {
        setPage(page => page - 1);
    }
  
    const handleNext = () => {
        setPage(page => page + 1);
    }

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            const token = localStorage.getItem('token');
            setLoading(true);

            try {
                const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(userResponse.data.user);

                const postsResponse = await axios.get(`${BACKEND_URL}/api/v1/blog/all?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(postsResponse.data.blogs);
                setTotal(postsResponse.data.totalPages);
                console.log(postsResponse.data.totalPages);
                console.log(postsResponse.data.blogs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user details or posts: " + error);
                setLoading(false);
            }
        };

        fetchUserAndPosts();
    }, []);

    const truncateString = (str: string, num: number) => {
        if (str.length <= num) {
          return str;
        }
        return str.slice(0, num) + "...";
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
                    posts.filter((post) => post.authorId === user?.id).map((post) => (
                        <div key={post.id} className="w-[70%] lg:w-[40%] mx-auto justify-between flex py-2 px-4 border-b">
                            <div>
                                <h2 className="font-medium">{post.title}</h2>
                                <p className="text-neutral-500 font-light">{post.content}</p>
                            </div>
                        </div>
                    ))
                    // posts.map((post) => (
                    // ))
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
