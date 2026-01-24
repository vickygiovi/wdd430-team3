const sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h4>Keywords</h4>

      <div className="tags">
        <span>Spring ✕</span>
        <span>Smart ✕</span>
        <span>Modern ✕</span>
      </div>

      <div className="filter">
        <label>
          <input type="checkbox" defaultChecked /> Label
        </label>
        <label>
          <input type="checkbox" /> Description
        </label>
        <label>
          <input type="checkbox" /> Label
        </label>
        <label>
          <input type="checkbox" /> Description
        </label>
      </div>

      <h4>Price</h4>
      <input type="range" min={0} max={100} />

      <h4>Color</h4>
      <label>
        <input type="checkbox" /> Label
      </label>

      <h4>Size</h4>
      <label>
        <input type="checkbox" /> Label
      </label>
      <label>
        <input type="checkbox" /> Label
      </label>
    </aside>
  );
};

export default sidebar;
