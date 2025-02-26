import './App.css';
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import UserGuide from "./pages/UserGuide/UserGuide.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";
import Documentation from "./pages/Documentation/Documentation.tsx";
import Login from "./pages/Login/Login.tsx";
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

function App() {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem('isAuthenticated') === 'true'
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAuthenticated');
    };

    useEffect(() => {
        const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated !== authStatus) {
            setIsAuthenticated(authStatus);
        }
    }, [isAuthenticated, location]);

    return (
        <>
            {isAuthenticated && <Navbar onLogout={handleLogout} />}

            <div className='page-content'>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/projects" replace /> : <Login onLogin={handleLogin} />}
                    />
                    <Route path="/project/:id/*" element={<ProjectPage/>}/>
                    <Route path="/projects" element={isAuthenticated ? <ProjectDashboard/> : <Navigate to="/login" replace />}/>
                    <Route path="/user-guide" element={isAuthenticated ? <UserGuide/> : <Navigate to="/login" replace />}/>
                    <Route path="/documentation" element={isAuthenticated ? <Documentation/> : <Navigate to="/login" replace />}/>
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
