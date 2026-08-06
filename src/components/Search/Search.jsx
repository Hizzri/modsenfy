function Search({ value, onChange }) {
  function handleInputChange(event) {
    const newSearchValue = event.target.value;

    onChange(newSearchValue);
  }

  return (
    <div className="search">
      <label className="visually-hidden" htmlFor="track-search">
        Search for a track
      </label>

      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>

      <input
        className="search__input"
        id="track-search"
        type="search"
        placeholder="Search artist, title, album"
        autoComplete="off"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Search;
