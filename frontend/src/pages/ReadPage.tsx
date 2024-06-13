import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const ReadPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setBlog(response.data.post);
        }).catch(error => {
            console.error('Error fetching blog: ' + error);
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
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.authorId}</p>
            <p>{blog.content}</p>
        </div>
    </div>
  )
}

export default ReadPage