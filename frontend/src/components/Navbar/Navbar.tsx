import './Navbar.css';
import Logo from '../../assets/STC.png';
import LanguageSelector from '../GenericComponents/LanguageSelector/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import User from '../../assets/Icons/User.svg';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
    onLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({onLogout}) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    }

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className="navbar">
            <nav className="left">
                <a href="/projects" className="logo" title='Go to Project Dashboard'>
                    <img src={Logo} alt="logo"/>
                </a>
                <a href="/projects" title='Go to Project Dashboard'>{t('navbar.project', 'Project')}</a>
                <a href="/user-guide" title='Go to User Guide'>{t('navbar.userGuide', 'User Guide')}</a>
                <a href="/documentation" title='Go to Technical Documentation (for IT Personnel)'>{t('navbar.documentation', 'Documentation')}</a>
            </nav>
            <nav className="right">
                <div title='Change Language'>
                    <LanguageSelector/>
                </div>
                <div
                    className="profile-dropdown"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    ref={dropdownRef}
                    title='User Menu'
                >
                    <img src={User} alt="User" />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <a href="#" onClick={handleLogout} className="dropdown-item">{t('navbar.logout', 'Logout')}</a>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
