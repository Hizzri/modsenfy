function Sort({ value, onChange }) {
  function handleSelectChange(event) {
    const newSortMethod = event.target.value;

    onChange(newSortMethod);
  }

  return (
    <label className="sort-control">
      <span className="sort-control__label">Sort by</span>

      <select className="sort-control__select" value={value} onChange={handleSelectChange}>
        <option value="popular">popular</option>
        <option value="recent">recent</option>
      </select>
    </label>
  );
}

export default Sort;
