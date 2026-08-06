import { NavLink } from 'react-router-dom';
import favoritesIcon from '../../assets/icons/favorites.svg';
import homeIcon from '../../assets/icons/home.svg';
import logoImage from '../../assets/icons/logo.svg';

function getNavigationLinkClass(linkInformation) {
  const isActive = linkInformation.isActive;

  if (isActive) {
    return 'navigation-link navigation-link--active';
  }

  return 'navigation-link';
}

function Sidebar({ isOpen, onCloseMenu }) {
  let sidebarClassName = 'sidebar';

  if (isOpen) {
    sidebarClassName = 'sidebar sidebar--open';
  }

  return (
    <aside className={sidebarClassName} id="main-sidebar">
      <div className="sidebar__header">
        <img className="sidebar__logo" src={logoImage} alt="Modsenfy" />

        <button
          className="sidebar__close-button"
          type="button"
          aria-label="Close navigation menu"
          onClick={onCloseMenu}
        >
          ×
        </button>
      </div>

      <p className="sidebar__section-title">Discover</p>

      <nav className="navigation">
        <NavLink className={getNavigationLinkClass} to="/" end onClick={onCloseMenu}>
          <img className="navigation-link__icon" src={homeIcon} alt="" aria-hidden="true" />

          <span>Home</span>
        </NavLink>

        <NavLink className={getNavigationLinkClass} to="/favorites" onClick={onCloseMenu}>
          <img className="navigation-link__icon" src={favoritesIcon} alt="" aria-hidden="true" />

          <span>Your favorites</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
