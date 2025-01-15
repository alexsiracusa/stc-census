import './Navbar.css'
import logo from '../assets/STC.png'

const Navbar = () => {
    return (
        <header className="header">
            <a href="/" className="logo">
                <img src = {logo} alt="logo"/>
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