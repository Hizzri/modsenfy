function HomePage() {
  return (
    <div className="home-page">
      <section className="search-section">
        <label className="visually-hidden" htmlFor="track-search">
          Search for a track
        </label>

        <input
          className="search-input"
          id="track-search"
          type="search"
          placeholder="Search artist, title, album"
        />
      </section>

      <section className="player-panel">
        <div className="player-panel__top">
          <p className="player-panel__title">Select a track to listen to</p>

          <label className="sort-control">
            <span>Sort by</span>

            <select className="sort-select" defaultValue="popular">
              <option value="popular">popular</option>
              <option value="recent">recent</option>
            </select>
          </label>
        </div>

        <div className="player-placeholder">
          The audio player will appear after selecting a track
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Search results</h2>

        <div className="empty-state">
          <span className="empty-state__icon">♫</span>
          <p className="empty-state__text">Start a search...</p>
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Recommended</h2>

        <div className="empty-state empty-state--small">
          <p className="empty-state__text">Recommendations will be loaded from the music API</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
