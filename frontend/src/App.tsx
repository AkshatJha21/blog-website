import { BrowserRouter ,Route, Routes } from "react-router-dom";
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReadPage from "./pages/ReadPage";
import CreatePage from "./pages/CreatePage";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./provider/userContext";
import UserPostsPage from "./pages/UserPostsPage";

function App() {

  return (
    <>
    <UserProvider>
      <BrowserRouter>
      <div>
        <Routes>
          <Route path='/signup' element={<SignupPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/' element={<HomePage />}/>
          <Route path='/read/:id' element={<ReadPage />}/>
          <Route path='/create' element={<CreatePage />}/>
          <Route path='/profile' element={<ProfilePage />}/>
          <Route path='/posts' element={<UserPostsPage />}/>
        </Routes>
      </div>
      </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
