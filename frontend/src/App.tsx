import { BrowserRouter ,Route, Routes } from "react-router-dom";
import { SignupPage } from './pages/SignupPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignupPage />}/>
          <Route path='/login'/>
          <Route path='/blog'/>
          <Route path='/create'/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
