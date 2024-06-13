import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Author {
    id: string;
    name: string;
  }
  
  interface Blog {
    id: number;
    title: string;
    content: string;
    author: Author
  }

const ReadPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>({});
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
            heading="TheBlog" 
            primaryBtn="New" 
            showPlus={true} 
            secondaryBtn="Logout" 
            primaryClick={() => {}}
            secondaryClick={() => {}}
        />
        <div className="w-[90%] flex flex-col mx-auto my-4">
            <h2>{blog.title}</h2>
            <div>{blog.author[0]}</div>
            <p>{blog.author}</p>
            <p>{blog.content}</p>
        </div>
    </div>
  )
}

export default ReadPage