import './Navbar.css';
import Logo from '../../assets/STC.png';
import LanguageSelector from '../GenericComponents/LanguageSelector/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import User from '../../assets/Icons/User.svg';

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

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
                <a href="/projects" className="logo">
                    <img src={Logo} alt="logo"/>
                </a>
                <a href="/projects">{t('navbar.project', 'Project')}</a>
                <a href="/user-guide">{t('navbar.userGuide', 'User Guide')}</a>
                <a href="/documentation">{t('navbar.documentation', 'Documentation')}</a>
            </nav>
            <nav className="right">
                <LanguageSelector/>
                <div
                    className="profile-dropdown"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    ref={dropdownRef}
                >
                    <img src={User} alt="User" />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <a href="/logout" className="dropdown-item">{t('navbar.logout', 'Logout')}</a>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
