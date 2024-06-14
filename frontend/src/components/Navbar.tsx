import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../provider/userContext";

interface NavbarProps {
    primaryBtn: string;
    showPlus: boolean;
    primaryClick: () => void;
}


const Navbar = ({
    primaryBtn,
    showPlus,
    primaryClick,
}: NavbarProps) => {
    const navigate = useNavigate();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

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

    // MEMOIZE THIS COMPONENT TO AVOID RERENDERS
    // PUT IN APP.TSX -> ONLY RENDERS ONCE AND PERSISTS THROUGHOUT THE APP

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
                            <div className="flex flex-col justify-center text-center  py-2">
                                <p className="font-medium">{user.name}</p>
                                <p className="font-light text-sm">{user.email}</p>
                            </div>
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

export default memo(Navbar);