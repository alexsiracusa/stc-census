import './App.css'
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import UserGuide from "./pages/UserGuide/UserGuide.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";
import {Route, Routes, Navigate} from 'react-router-dom';

function App() {
    return (
        <>
            <Navbar/>

            <div className='page-content'>
                <Routes>
                    <Route path="/project/:id/*" element={<ProjectPage/>}/>
                    <Route path="/projects" element={<ProjectDashboard/>}/>
                    <Route path="/user-guide" element={<UserGuide/>}/>
                    <Route
                        path="*"
                        element={<Navigate to="/projects" replace/>}
                    />
                </Routes>
            </div>
        </>
    )
}

export default App
