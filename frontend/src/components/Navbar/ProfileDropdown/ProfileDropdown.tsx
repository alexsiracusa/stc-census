import User from "../../../assets/Icons/User.svg";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";


const ProfileDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div
            className="profile-dropdown"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            ref={dropdownRef}
            title='User Menu'
        >
            <img src={User} alt="User"/>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <a href="#" onClick={handleLogout} className="dropdown-item">{t('navbar.logout', 'Logout')}</a>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown