import "./DollBuilder.css";
import { Slider } from "../Slider/Slider.tsx";

export function DollBuilder() {
  const heads = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-" + num}></div>
  ));
  const body = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-B" + num}></div>
  ));

  return (
    <div className="doll-builder-container">
      <Slider slides={heads} />
      <Slider slides={body} />
    </div>
  );
}
