import './Navbar.css';
import Logo from '../../assets/STC.png';
import LanguageSelector from '../LanguageSelector/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { CiUser } from "react-icons/ci";

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
                <a href="/" className="logo">
                    <img src={Logo} alt="logo" />
                </a>
                <a href="/">{t('navbar.home', 'Home')}</a>
                <a href="/menu">{t('navbar.menu', 'Menu')}</a>
                <a href="/projects">{t('navbar.project', 'Project')}</a>
            </nav>
            <nav className="right">
                <LanguageSelector />
                <div
                    className="profile-dropdown"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    ref={dropdownRef}
                >
                    <CiUser className="profile-icon" />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <a href="/profile" className="dropdown-item">Profile</a>
                            <a href="/settings" className="dropdown-item">Settings</a>
                            <a href="/logout" className="dropdown-item">Logout</a>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
