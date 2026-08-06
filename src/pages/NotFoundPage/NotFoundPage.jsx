import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <p className="not-found-page__code">404</p>

      <h2 className="not-found-page__title">Page not found</h2>

      <p className="not-found-page__text">The requested page does not exist.</p>

      <Link className="not-found-page__link" to="/">
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
