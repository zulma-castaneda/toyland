import "./DollBuilder.css";
import { Slider } from "../Slider/Slider.tsx";

interface DollBuilderProps {
  onHeadUpdate: (head: number) => void;
  onBodyUpdate: (body: number) => void;
}

export function DollBuilder({onHeadUpdate, onBodyUpdate}: DollBuilderProps) {

  const heads = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-" + num}></div>
  ));
  const body = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-B" + num}></div>
  ));

  return (
    <div className="doll-builder-container">
      <Slider onChangeSlide={s => onHeadUpdate(s + 1)} slides={heads} />
      <Slider onChangeSlide={s => onBodyUpdate(s + 1)} slides={body} />

    </div>
  );
}
