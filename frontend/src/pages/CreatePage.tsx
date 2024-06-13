import Navbar from "../components/Navbar"

const CreatePage = () => {
  return (
    <div>
        <Navbar 
            heading="TheBlog" 
            primaryBtn="Publish" 
            showPlus={false} 
            secondaryBtn="U" 
            primaryClick={() => {}}
            secondaryClick={() => {}}
        />
        <div className="flex flex-col">
            <input type="text" placeholder="title"/>
            <input type="text" placeholder="content"/>
        </div>
    </div>
  )
}

export default CreatePage