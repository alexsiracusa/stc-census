import './App.css'
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/Project.tsx";
import {Route, Routes, BrowserRouter} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes className='page-content'>
                <Route path="/" element={<ProjectPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
