import './Navbar.css';
import Logo from '../../assets/STC.png';
import LanguageSelector from '../GenericComponents/LanguageSelector/LanguageSelector.tsx';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router";
import ProfileDropdown from "./ProfileDropdown/ProfileDropdown.tsx";

const Navbar: React.FC = () => {
    const {t} = useTranslation();
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

    const openPdf = (filename) => {
        window.open(`/${filename}`, "_blank", "noopener,noreferrer");
    };

    return (
        <header className="navbar">
            <nav className="left">
                <Link to="/projects" className="logo" title='Go to Project Dashboard'>
                    <img src={Logo} alt="logo"/>
                </Link>

                <Link to={"/projects"} title='Go to Project Dashboard'>{t('navbar.project', 'Project')}</Link>

                <button
                    onClick={() => {openPdf('user-guide.pdf')}}
                    title='Go to User Guide'
                >
                    {t('navbar.userGuide', 'User Guide')}
                </button>

                <button
                    onClick={() => {openPdf('documentation.pdf')}}
                    title='Go to Technical Documentation (for IT Personnel)'
                >
                    {t('navbar.documentation', 'Documentation')}
                </button>

                    <Link to={"/account-manager"} title='Go to Account Manager'>
                        {t('navbar.accountManager', 'Account Manager')}
                    </Link>
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
