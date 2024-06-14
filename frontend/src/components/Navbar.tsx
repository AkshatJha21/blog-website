import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    primaryBtn: string;
    showPlus: boolean;
    secondaryBtn: string;
    primaryClick: () => void;
    secondaryClick: () => void;
}

const Navbar = ({
    primaryBtn,
    showPlus,
    primaryClick,
}: NavbarProps) => {
    const navigate = useNavigate();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const handleHome = () => {
        navigate('/');
    }

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }
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
                    <div onClick={toggleMenu} className="bg-neutral-100 font-medium rounded-full h-10 w-10 p-1 flex items-center justify-center cursor-pointer hover:bg-neutral-200 hover:border-neutral-500 hover:text-black text-neutral-500 border-2 border-neutral-400 transition-all">U</div> 
                    {isMenuVisible && (
                        <div className="absolute bg-white right-0 mt-2 w-48 shadow-lg p-2 z-20 rounded-sm">
                            <div>
                                User Name
                            </div>
                            <ul className="py-1">
                                <li>
                                    Profile
                                </li>
                                <li>
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