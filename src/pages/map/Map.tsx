import './Map.css';
import { useEffect, useRef, useState } from 'react';

function Map() {
  const borderHeight = 19;
  const [offsetY, setOffsetY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onScroll();
  }, []);

  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
  }

  const onScroll = () => {
    const containerRef = mapContainerRef?.current!;
    const scrollPosition = containerRef.scrollTop / (containerRef.scrollHeight - containerRef.clientHeight);
    setOffsetY(computeYPosition(scrollPosition));
    setOffsetX(computeXPosition(scrollPosition));
  };

  const computeYPosition = (scrollPosition: number) => {
    const characterHeight = characterRef?.current!.clientHeight;
    const rootHeight = document.getElementById('root')!.clientHeight;
    return mapRange(scrollPosition, 0, 1, borderHeight, rootHeight - borderHeight - characterHeight);
  };

  const computeXPosition = (scrollPosition: number) => {
    const containerWidth = mapContainerRef?.current!.clientWidth;
    const characterWidth = characterRef?.current!.clientWidth;
    const sinPosition = mapRange(scrollPosition,0, 1, 0, 3*Math.PI);
    return mapRange(Math.sin(sinPosition), -1, 1, 0, containerWidth - characterWidth);
  };

  const characterMovementStyle = {
    transform: `translate(${offsetX}px, ${offsetY}px)`,
  };

  return (
    <div className='map-container' ref={mapContainerRef} onScroll={onScroll}>
      <div className='map' ref={mapRef}></div>
      <div className='character' ref={characterRef} style={characterMovementStyle}/>
    </div>
  );
}

export default Map;
