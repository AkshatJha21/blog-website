import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

interface NavbarProps {
    primaryBtn: string;
    showPlus: boolean;
    primaryClick: () => void;
}

interface User {
    id: string;
    name:  string;
    email: string;
}

const Navbar = ({
    primaryBtn,
    showPlus,
    primaryClick,
}: NavbarProps) => {
    const navigate = useNavigate();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User>({name: "", id: "", email: ""});

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`${BACKEND_URL}/api/v1/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUser(response.data.user);
        }).catch(err => {
            console.error("Error finding user: " + err);     
        })
    }), [];

    const handleHome = () => {
        navigate('/');
    }

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuVisible(false);
        }
    }

    useEffect(() => {
        if (isMenuVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isMenuVisible]);

  return (
    <nav className="flex justify-between items-center mx-2">
            <h2 className="font-black text-xl sm:text-2xl p-4 cursor-pointer" onClick={handleHome}>TheBlog</h2>
            <div className="p-4 flex items-center space-x-4">
                <button onClick={primaryClick} className="bg-black text-white py-2 px-4 rounded-sm flex justify-evenly items-center text-center hover:opacity-75 transition-all duration-200">
                    {showPlus ? (
                        <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14m-7 7V5"/>
                        </svg>
                    ) : null}
                    <p className="font-medium text-sm">{primaryBtn}</p>
                </button>
                <div className="relative">
                    <div onClick={toggleMenu} className="bg-neutral-100 font-medium rounded-full h-10 w-10 p-1 flex items-center justify-center cursor-pointer hover:bg-neutral-200 hover:border-neutral-500 hover:text-black text-neutral-500 border-2 border-neutral-400 transition-all">
                        {user.name[0]}    
                    </div> 
                    {isMenuVisible && (
                        <div ref={menuRef} className="absolute bg-white right-0 mt-2 w-48 shadow-md border p-2 z-20 rounded-sm">
                            <ul>
                                <li 
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer"
                                    onClick={() => navigate('/profile')}
                                >
                                    Profile
                                </li>
                                <li 
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer"
                                    onClick={() => navigate('/posts')}
                                >
                                    Posts
                                </li>
                                <li 
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer"
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                    }}
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
  )
}

export default Navbar