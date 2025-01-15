import './Navbar.css'
import Logo from '../assets/STC.png'

const Navbar = () => {
    return (
        <header className="header">
            <a href="/" className="logo">
                <img src={Logo} alt="logo"/>
            </a>

            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/menu">Menu</a>
                <a href="/project">Project</a>
            </nav>
        </header>
    )
}

export default Navbar;