import "./DollBuilder.css";
import { Slider } from "../Slider/Slider.tsx";
import { useState } from 'react';

interface DollBuilderProps {
  onCreateDoll: (head: number, body: number) => void;
}

export function DollBuilder({onCreateDoll}: DollBuilderProps) {
  const [selectedHead, setSelectedHead] = useState(0);
  const [selectedBody, setSelectedBody] = useState(0);

  const heads = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-" + num}></div>
  ));
  const body = [1, 2, 3].map((num) => (
    <div className={"sprite sprite-B" + num}></div>
  ));

  return (
    <div className="doll-builder-container">
      <Slider onChangeSlide={setSelectedHead} slides={heads} />
      <Slider onChangeSlide={setSelectedBody} slides={body} />
      <button onClick={() => {onCreateDoll(selectedHead + 1, selectedBody + 1)}}>Agregar muñeca</button>
    </div>
  );
}
