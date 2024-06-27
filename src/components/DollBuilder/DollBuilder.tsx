import './DollBuilder.css';
import { Slider } from '../Slider/Slider.tsx';

export function DollBuilder() {
  const slides = [1,2,3,4,5,6,7,8,9,10].map(num => (<div>{num}</div>));

  return (
    <div className='doll-builder-container'>
      <Slider slides={slides}/>
    </div>
  );
}
