import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter.ts";

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    useOutsideAlerter(dropdownRef, () => {setIsDropdownOpen(false)});

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        setIsDropdownOpen(false);
    };


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