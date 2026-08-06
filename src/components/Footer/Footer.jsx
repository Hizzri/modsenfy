import logoImage from '../../assets/icons/logo.svg';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__about">
        <img className="footer__logo" src={logoImage} alt="Modsenfy" />

        <p className="footer__description">
          We have sounds that capture every mood and inspire every vision. From soothing melodies to
          electrifying beats.
        </p>
      </div>

      <div className="footer__column">
        <h2 className="footer__title">Company</h2>
        <a className="footer__link" href="#about">
          About
        </a>
        <a className="footer__link" href="#features">
          Features
        </a>
      </div>

      <div className="footer__column">
        <h2 className="footer__title">Help</h2>
        <a className="footer__link" href="#support">
          Customer Support
        </a>
        <a className="footer__link" href="#delivery">
          Delivery Details
        </a>
      </div>

      <div className="footer__column">
        <h2 className="footer__title">FAQ</h2>
        <a className="footer__link" href="#account">
          Account
        </a>
        <a className="footer__link" href="#deliveries">
          Manage Deliveries
        </a>
      </div>

      <div className="footer__column">
        <h2 className="footer__title">Resources</h2>
        <a className="footer__link" href="#books">
          Free eBooks
        </a>
        <a className="footer__link" href="#tutorial">
          Development Tutorial
        </a>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">Modsenfy © 2000-{currentYear}, All Rights Reserved</p>

        <div className="footer__socials">
          <span>Contact us</span>
          <span className="footer__social-icon">in</span>
          <span className="footer__social-icon">◎</span>
          <span className="footer__social-icon">▶</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
