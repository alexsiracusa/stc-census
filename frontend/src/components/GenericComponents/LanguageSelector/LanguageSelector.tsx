import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css";

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="language-selector" ref={dropdownRef}>
            <div
                className="language-dropdown"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                title="Change Language"
            >
                {language === "en" ? "En" : "简"}
            </div>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <div
                        className="dropdown-item"
                        onClick={() => changeLanguage("en")}
                    >
                        En
                    </div>
                    <div
                        className="dropdown-item"
                        onClick={() => changeLanguage("scn")}
                    >
                        简
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;