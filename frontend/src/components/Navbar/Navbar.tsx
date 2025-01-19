import './Navbar.css';
import Logo from '../../assets/STC.png';
import Circle from '../../assets/circle-32.png';
import LanguageSelector from '../LanguageSelector/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <header className="header">
            <a href="/" className="logo">
                <img src={Logo} alt="logo" />
            </a>

            <nav className="navbar">
                <a href="/">{t('navbar.home', 'Home')}</a>
                <a href="/menu">{t('navbar.menu', 'Menu')}</a>
                <a href="/project">{t('navbar.project', 'Project')}</a>
            </nav>

            <LanguageSelector />

            <div className="profile-icon">
                <a href="/profile">
                    <img src={Circle} alt="Profile" />
                </a>
            </div>
        </header>
    );
};

export default Navbar;
