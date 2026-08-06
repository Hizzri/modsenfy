function Pagination({
  currentPage,
  isPreviousDisabled,
  isNextDisabled,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <div className="pagination">
      <button
        className="pagination__button"
        type="button"
        disabled={isPreviousDisabled}
        onClick={onPreviousPage}
      >
        Previous
      </button>

      <span className="pagination__page">Page {currentPage}</span>

      <button
        className="pagination__button"
        type="button"
        disabled={isNextDisabled}
        onClick={onNextPage}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
