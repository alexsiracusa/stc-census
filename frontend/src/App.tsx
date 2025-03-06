import './App.css';
import Navbar from './components/Navbar/Navbar.tsx';
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import ProjectDashboard from "./pages/ProjectDashboard/ProjectDashboard.tsx";
import AccountManager from "./pages/AccountManager/AccountManager.tsx";
import Login from "./pages/Login/Login.tsx";
import { Route, Routes, Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import useFetchUser from "./hooks/useFetchUser.ts";

function App() {
    const { loading, error } = useFetchUser()
    const user = useSelector((state) => state.accounts.user);

    if (!user && loading) {
        return <>Loading</>
    }

    return (
        <>
            <Navbar/>

            <div className='page-content'>
                <Routes>
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/projects" replace /> : <Login/>}
                    />
                    {/*TODO fix routing when logged in*/}
                    <Route path="/project/:id/*" element={user ? <ProjectPage/> : <Navigate to="/login" replace />}/>
                    <Route path="/projects" element={user ? <ProjectDashboard/> : <Navigate to="/login" replace />}/>
                    <Route path="/account-manager" element={user && user.admin ? <AccountManager/> : <Navigate to="/login" replace />}/>
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
