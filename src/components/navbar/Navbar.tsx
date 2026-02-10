import { Link } from 'react-router-dom'
const logo = `${import.meta.env.BASE_URL}assets/logos/Logo - White - A.png`
import './Navbar.css'

const TABS = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Competitions', path: '/competitions' },
  { label: 'Team', path: '/team' },
  { label: 'Join', path: '/join' },
  { label: 'Sponsors', path: '/sponsors' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/login' },
] as const

function Navbar() {
  const leftTabs = TABS.slice(0, 4)
  const rightTabs = TABS.slice(4)

  return (
    <div className="navbar">
      <nav className="navbar__inner" aria-label="Main navigation">
        <div className="navbar__left">
          {leftTabs.map((tab) => (
            <Link key={tab.label} to={tab.path} className="navbar__tab">
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="navbar__center">
          <Link to="/" className="navbar__logo-link" aria-label="Home">
            <img src={logo} alt="Nirmaan '26" className="navbar__logo" />
          </Link>
        </div>
        <div className="navbar__right">
          {rightTabs.map((tab) => (
            <Link key={tab.label} to={tab.path} className="navbar__tab">
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
