function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        ♫
      </span>

      <h3 className="empty-state__title">{title}</h3>

      {text ? <p className="empty-state__text">{text}</p> : null}
    </div>
  );
}

export default EmptyState;
