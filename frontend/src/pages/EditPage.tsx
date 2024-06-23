import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BACKEND_URL } from "../config";
import { BlogUpdate } from "@akshatjha21/medium-common";

const EditPage = () => {
    const { id } = useParams<{ id: string }>();
    const blogId = parseInt(id || "", 10);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [blogInputs, setBlogInputs] = useState<BlogUpdate>({
        id: blogId.toString(),
        title: "",
        content: ""
    });

    useEffect(() => {
        const fetchBlogPost = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBlogInputs({
                    id: response.data.id.toString(),
                    title: response.data.blog.title,
                    content: response.data.blog.content
                });
                setLoading(false);
                inputRef.current?.focus();
            } catch (error) {
                console.error("Error fetching the blog post: " + error);
                setLoading(false);
            }
        };

        fetchBlogPost();
    }, [id]);

    const handlePublish = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BACKEND_URL}/api/v1/blog`, {
                id: blogInputs.id,
                title: blogInputs.title,
                content: blogInputs.content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error("Error updating the blog: " + error);
        }
    };

    const isNotFilled = !blogInputs.title || !blogInputs.content;

    return (
        <div>
            <Navbar 
                primaryBtn="Publish" 
                showPlus={false} 
                primaryClick={handlePublish}
                publishedDisabled={isNotFilled}
            />
            {loading ? (
                <EditPageSkeleton />
            ) : (
                <div className="w-[90%] flex flex-col mx-auto my-4 relative">
                    <input 
                        ref={inputRef} 
                        className="text-2xl font-bold mb-4 p-1 focus:outline-none" 
                        type="text" 
                        placeholder="Enter a title"
                        value={blogInputs.title}
                        onChange={(e) => {
                            setBlogInputs(c => ({
                                ...c,
                                title: e.target.value
                            }));
                        }}
                    />
                    <textarea 
                        rows={20} 
                        className="focus:outline-none resize-none p-1 text-lg mt-4 font-serif" 
                        placeholder="Write your blog here"
                        value={blogInputs.content}
                        onChange={(e) => {
                            setBlogInputs(c => ({
                                ...c,
                                content: e.target.value
                            }));
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const EditPageSkeleton = () => {
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
    );
};

export default EditPage;
