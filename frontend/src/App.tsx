import './App.css'
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";
import {Route, Routes} from 'react-router-dom';
import ProjectSidebar from "./components/ProjectSidebar/ProjectSidebar.tsx";

function App() {
    return (
        <>
            <Navbar/>
            <ProjectSidebar id={0}/>
            <div className='page-content'>
                <Routes>
                    <Route path="/project/:id/*" element={<ProjectPage/>}/>
                    <Route path="/projects" element={<ProjectDashboard/>}/>
                    <Route path="/" element={<HomePage/>}/>
                </Routes>
            </div>
        </>
    )
}

export default App
