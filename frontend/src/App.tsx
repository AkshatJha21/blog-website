import { BrowserRouter ,Route, Routes } from "react-router-dom";
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignupPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/' element={<HomePage />}/>
          <Route path='/create'/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
