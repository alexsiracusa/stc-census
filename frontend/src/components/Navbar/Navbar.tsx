import './Navbar.css';
import Logo from '../../assets/STC.png';
import LanguageSelector from '../GenericComponents/LanguageSelector/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown.tsx";

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
                <a href="/projects" className="logo" title='Go to Project Dashboard'>
                    <img src={Logo} alt="logo"/>
                </a>
                <Link to={"/projects"} title='Go to Project Dashboard'>{t('navbar.project', 'Project')}</Link>
                <a href="/user-guide" title='Go to User Guide'>{t('navbar.userGuide', 'User Guide')}</a>
                <a href="/documentation" title='Go to Technical Documentation (for IT Personnel)'>{t('navbar.documentation', 'Documentation')}</a>
            </nav>
            <nav className="right">
                <div title='Change Language'>
                    <LanguageSelector/>
                </div>
                <ProfileDropdown/>
            </nav>
        </header>
    );
};

export default Navbar;
