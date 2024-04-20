import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './GaspMap.css';

function GaspMap() {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.to('.box', {rotation: 180});
  }, { scope: container });

  return (
    <div ref={container} className='map-container'>
      <div className='box'></div>
    </div>
  );
}

export default GaspMap;
