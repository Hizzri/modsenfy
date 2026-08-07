import logoImage from '../../assets/icons/logo.svg';

function Header({ isMenuOpen, onToggleMenu }) {
  return (
    <header className="mobile-header">
      <img className="mobile-header__logo" src={logoImage} alt="Modsenfy" />

      <button
        className={isMenuOpen ? 'menu-button menu-button--open' : 'menu-button'}
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="main-sidebar"
        onClick={onToggleMenu}
      >
        <span className="menu-button__line"></span>
        <span className="menu-button__line"></span>
        <span className="menu-button__line"></span>
      </button>
    </header>
  );
}

export default Header;
