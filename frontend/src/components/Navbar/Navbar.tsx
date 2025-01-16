import './Navbar.css'
import Logo from '../../assets/STC.png'

const Navbar = () => {
    return (
        <header className="header">
            <a href="/" className="logo">
                <img src={Logo} alt="logo"/>
            </a>

            <nav className="navbar">
                <a href="/">Home</a>
                <a href="/menu">Menu</a>
                <a href="/project/-1">Project</a>
            </nav>
        </header>
    )
}

export default Navbar;