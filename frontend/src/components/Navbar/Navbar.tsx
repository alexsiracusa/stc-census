import './Navbar.css'
import Logo from '../../assets/STC.png'

const Navbar = () => {
    return (
        <header className="header">
            <a href="/frontend/public" className="logo">
                <img src={Logo} alt="logo"/>
            </a>

            <nav className="navbar">
                <a href="/home">Home</a>
                <a href="/menu">Menu</a>
                <a href="/ProjectPage/Project">Project</a>
            </nav>
        </header>
    )
}

export default Navbar;