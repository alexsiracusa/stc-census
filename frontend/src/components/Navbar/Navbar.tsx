import './Navbar.css'
import Logo from '../../assets/STC.png'
import Circle from '../../assets/circle-32.png'
import { useTranslation } from 'react-i18next';
import { useState } from 'react'

const Navbar = () => {
    const {t, i18n} = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const changeLanguage = (lang: string)=> {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    }

    return (
        <header className="header">
            <a href="/" className="logo">
                <img src={Logo} alt="logo"/>
            </a>

            <nav className="navbar">
                <a href="/">{t('navbar.home', 'Home')}</a>
                <a href="/menu">{t('navbar.menu', 'Menu')}</a>
                <a href="/projects">{t('navbar.project', 'Project')}</a>
            </nav>

            <div className="language-selector">
                <label htmlFor="language">{t('')}</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    >

                    <option value="en">English</option>
                    <option value="scn">简体中文</option>
                    <option value="tcn">繁體中文</option>
                </select>
            </div>

            <div className="profile-icon">
                <a href="/profile">
                    <img src={Circle} alt="Profile" />
                </a>
            </div>
        </header>
    )
}

export default Navbar;