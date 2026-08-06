import heroImage from '../../assets/images/hero.png';

function HeroBanner() {
  return (
    <section className="hero-banner">
      <img className="hero-banner__image" src={heroImage} alt="Musician playing a bass guitar" />

      <div className="hero-banner__overlay"></div>

      <h1 className="hero-banner__title">live music</h1>
    </section>
  );
}

export default HeroBanner;
