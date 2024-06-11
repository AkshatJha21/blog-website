import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect } from "react";
import BlogList from "../components/BlogList";


const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error('Error finding authorisation token: ', error);
            }
        }

        checkAuth();
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
        {/* 
            -> Get all blogs and on clicking should redirect to that particular blog
            -> also add filter for getting your blogs
        */}

        <BlogList />
    </div>
  )
}

export default HomePage