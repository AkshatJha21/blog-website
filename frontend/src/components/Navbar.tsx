interface NavbarProps {
    heading: string;
    primaryBtn: string;
    showPlus: boolean;
    secondaryBtn: string;
    primaryClick: () => void;
    secondaryClick: () => void;
}

const Navbar = ({
    heading,
    primaryBtn,
    showPlus,
    secondaryBtn,
    primaryClick,
    secondaryClick
}: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center mx-2">
            <h2 className="font-black text-xl sm:text-2xl p-4">{heading}</h2>
            <div className="p-4 flex items-center space-x-4">
                <button onClick={primaryClick} className="bg-black text-white py-2 px-4 rounded-sm flex justify-evenly items-center text-center hover:opacity-75 transition-all duration-200">
                    {showPlus ? (
                        <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14m-7 7V5"/>
                        </svg>
                    ) : null}
                    <p className="font-medium text-sm">{primaryBtn}</p>
                </button>
                <button onClick={secondaryClick} className="text-sm py-2 px-4 bg-neutral-200 rounded-sm hover:bg-neutral-300 transition-all duration-200 font-medium">{secondaryBtn}</button>    
            </div>
        </nav>
  )
}

export default Navbar