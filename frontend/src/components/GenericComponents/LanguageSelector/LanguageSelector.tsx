import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css"

const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    };

    return (
        <div className="language-selector">
            <label htmlFor="language">{t('')}</label>
            <select
                id="language"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
            >
                <option value="en">En</option>
                <option value="scn">简</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
