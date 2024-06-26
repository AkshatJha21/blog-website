import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../provider/userContext";

type Button = "New" | "Publish";

interface NavbarProps {
    primaryBtn: Button;
    showPlus: boolean;
    primaryClick: () => void;
    publishedDisabled?: boolean;
}


const Navbar = ({
    primaryBtn,
    showPlus,
    primaryClick,
    publishedDisabled
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

  return (
    <nav className="flex justify-between items-center mx-2">
            <h2 className="flex font-black text-xl sm:text-2xl p-4 cursor-pointer" onClick={handleHome}>
                TheBlog
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z" clipRule="evenodd"/>
                </svg>
            </h2>
            <div className="p-4 flex items-center space-x-4">
                <button 
                    disabled={publishedDisabled} 
                    onClick={primaryClick} 
                    className={`bg-black text-white py-2 px-4 rounded-sm flex justify-evenly items-center text-center hover:opacity-75 transition-all duration-200 ${publishedDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:opacity-75 transition-all duration-200'}`}
                >
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
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer flex items-center"
                                    onClick={() => navigate('/profile')}
                                >
                                    <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                    Profile
                                </li>
                                <li 
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer flex items-center"
                                    onClick={() => navigate('/posts')}
                                >
                                    <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
                                    </svg>
                                    Posts
                                </li>
                                <li 
                                    className="p-2 hover:bg-neutral-100 rounded-sm transition-all cursor-pointer flex items-center"
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                                    </svg>

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