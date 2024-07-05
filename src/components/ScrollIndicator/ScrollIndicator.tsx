import "./ScrollIndicator.css";
export function ScrollIndicator() {
  return (
    <div id="scroll-down-animation">
      <span className="mouse">
        <span className="move"></span>
      </span>
      <h3 className="scroll-indicator--text">Desliza hacia arriba</h3>
    </div>
  );
}
