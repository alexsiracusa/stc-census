import './App.css'
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";

import {Route, Routes, BrowserRouter} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Navbar/>

            <div className='page-content'>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/project/:id/:page/" element={<ProjectPage/>}/>
                    <Route path="/projects" element={<ProjectDashboard/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
