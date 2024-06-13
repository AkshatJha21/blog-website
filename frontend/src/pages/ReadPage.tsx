import Navbar from "../components/Navbar"

const ReadPage = () => {
    
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
    </div>
  )
}

export default ReadPage