import './App.css';
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import UserGuide from "./pages/UserGuide/UserGuide.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";
import Documentation from "./pages/Documentation/Documentation.tsx";
import Login from "./pages/Login/Login.tsx";
import { Route, Routes, Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import useFetchUser from "./hooks/useFetchUser.ts";

function App() {
    const { loading, error } = useFetchUser()
    const isAuthenticated = useSelector((state) => state.accounts.user);

    if (!isAuthenticated && loading) {
        return <>Loading</>
    }

    return (
        <>
            <Navbar/>

            <div className='page-content'>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/projects" replace /> : <Login/>}
                    />
                    {/*TODO fix routing when logged in*/}
                    <Route path="/project/:id/*" element={isAuthenticated ? <ProjectPage/> : <Navigate to="/login" replace />}/>
                    <Route path="/projects" element={isAuthenticated ? <ProjectDashboard/> : <Navigate to="/login" replace />}/>
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
