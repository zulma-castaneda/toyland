import "./ScrollIndicator.css";
export function ScrollIndicator() {
  return (
    <div id="scroll-down-animation">
      <span className="mouse">
        <span className="move"></span>
      </span>
      <h2 className="scroll-indicator--text">Desliza hacia abajo</h2>
    </div>
  );
}
