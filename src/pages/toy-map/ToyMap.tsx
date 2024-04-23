import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import './ToyMap.css';
import { GSDevTools } from 'gsap-trial/GSDevTools';
import { mapConfig } from './map-config.ts';
import { useNavigate } from 'react-router-dom';

export function ToyMap() {
  const navigate = useNavigate();
  const [selectedIsland, setSelectedIsland] = useState<null | number>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const islandRefs = Array.from({length: mapConfig.islands.length}, () => useRef<SVGImageElement | null>(null));
  const islandSelectAnimations: ReturnType<typeof gsap.timeline>[] = [];

  useGSAP((_, contextSafe) => {
    const ww = mapContainerRef.current!.clientWidth;
    const wh = mapContainerRef.current!.clientHeight;
    const speed = 20;
    const scrollDist = wh * speed;
    const scrollEnd = wh * (speed - 1);
    let flippedX = false;
    let flippedY = false;

    gsap.set('#scrollDist', {width: '100%', height: scrollDist});
    gsap.set('#container', {
      position: 'fixed',
      width: mapConfig.map.width,
      height: mapConfig.map.height,
      transformOrigin: '0 0',
      left: ww / 2,
      top: wh / 2,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 1
    });

    const main = gsap
      .timeline({
        defaults: {duration: 10, ease: 'none'},
        scrollTrigger: {
          trigger: '#scrollDist',
          start: 'top top',
          end: '+=' + scrollEnd,
          scrub: 0.3,
          scroller: mapContainerRef.current,
          onUpdate: contextSafe!((scrollTrigger: ScrollTrigger) => {
            const rotation = gsap.getProperty('#ship', 'rotation') as number,
              flipY = Math.abs(rotation) > 110,
              flipX = scrollTrigger.direction === 1;
            if (flipY !== flippedY || flipX !== flippedX) {
              gsap.to('#ship', {scaleY: flipY ? -1 : 1, scaleX: flipX ? 1 : -1, duration: 0.25});
              flippedY = flipY;
              flippedX = flipX;
            }
          }),
        },
      })
      .to('#ship', {
        motionPath: {
          path: '#path',
          align: '#path',
          alignOrigin: [0.5, 0.5],
          autoRotate: 0
        },
      }, 0);

    const onSelectIsland = contextSafe!((islandId: number) => {
      islandSelectAnimations[islandId].play(0);
      setSelectedIsland(islandId);
    });

    const onUnselectIsland = contextSafe!((islandId: number) => {
      islandSelectAnimations[islandId].pause();
      gsap.to(islandRefs[islandId].current, { y: 0, ease: 'bounce.out', duration: 0.75 });
      setSelectedIsland(null);
    });

    islandRefs.forEach((island, index) => {
      const { start, end} = mapConfig.islands[index];
      const selectAnimation = gsap
        .timeline({defaults: {duration: 0.5}})
        .to(island.current, { y: -30, ease: 'power1.out' })
        .to(island.current, { y: 0, ease: 'power1.in' });

      selectAnimation.pause();
      selectAnimation.repeat(-1);
      islandSelectAnimations[index] = selectAnimation;

      main
        .set(island.current, {
          onComplete: () => onSelectIsland(index),
          onReverseComplete: () => onUnselectIsland(index),
        }, start)
        .set(island.current, {
          onComplete: () => onUnselectIsland(index),
          onReverseComplete: () => onSelectIsland(index),
        }, end);
    });

    window.onresize = contextSafe!(() => {
      gsap.set('#container', {left: window.innerWidth / 2, top: window.innerHeight / 2});
    });

    main.seek(0.001);

    // For debugging animation
    if(import.meta.env.DEV) {
      GSDevTools.create({animation: main});
    }
  }, {scope: mapContainerRef});

  useEffect(() => {
    const pos = {x: -mapConfig.map.width / 2, y: -mapConfig.map.height / 2};
    const xSet = gsap.quickSetter('#container', 'x', 'px');
    const ySet = gsap.quickSetter('#container', 'y', 'px');

    function updateMapPosition() {
      pos.x += (-gsap.getProperty('#ship', 'x') - pos.x);
      pos.y += (-gsap.getProperty('#ship', 'y') - pos.y);
      xSet(pos.x);
      ySet(pos.y);
    }

    gsap.ticker.add(updateMapPosition);

    return () => gsap.ticker.remove(updateMapPosition);
  }, []);

  const onClick = () => {
    if(selectedIsland !== null) {
      navigate(`/selected-island?islandId=${selectedIsland}`);
    }
  };

  return (
    <div className='map-container' ref={mapContainerRef} onClick={onClick}>
      <div id='scrollDist'></div>
      <div id='container'>
        <svg id='map' ref={mapRef} width={mapConfig.map.width} height={mapConfig.map.height}>
          <path
            id='path'
            d={mapConfig.ship.path}
            fill='none'
            stroke='#676767'
            strokeWidth='5'
            strokeDasharray="7,5"
          />
          <g>
            {mapConfig.islands.map((islandConfig, index) => (
              <image
                key={index}
                ref={islandRefs[index]}
                x={islandConfig.x}
                y={islandConfig.y}
                width={islandConfig.width}
                height={islandConfig.height}
                href={islandConfig.image}
              />
            ))}
          </g>
          <g id='ship'>
            <image
              x={(mapConfig.map.width / 2) - (mapConfig.ship.width / 2)}
              y={(mapConfig.map.height / 2) - (mapConfig.ship.height / 2)}
              width={mapConfig.ship.width}
              height={mapConfig.ship.height}
              href={mapConfig.ship.image}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
