import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import HeroBanner from '../HeroBanner/HeroBanner';
import Sidebar from '../Sidebar/Sidebar';
import './AppLayout.scss';

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <div className="application">
        <Header isMenuOpen={isMobileMenuOpen} onToggleMenu={toggleMobileMenu} />

        <div className="application__body">
          <Sidebar isOpen={isMobileMenuOpen} onCloseMenu={closeMobileMenu} />

          <div className="application__main-column">
            <HeroBanner />

            <main className="page-content">
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>
      </div>

      <button
        className={isMobileMenuOpen ? 'menu-overlay menu-overlay--visible' : 'menu-overlay'}
        type="button"
        aria-label="Close navigation menu"
        onClick={closeMobileMenu}
      ></button>
    </>
  );
}

export default AppLayout;
