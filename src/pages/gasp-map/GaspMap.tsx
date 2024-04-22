import { useRef, useState } from 'react';
import { gsap } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import './GaspMap.css';
import { GSDevTools } from 'gsap-trial/GSDevTools';
import mapConfig from './map-config.ts';
import Timeline = gsap.core.Timeline;
import { useNavigate } from 'react-router-dom';

function GaspMap() {
  const navigate = useNavigate();
  const [selectedIsland, setSelectedIsland] = useState<null | number>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const islandRefs = [];
  const islandSelectAnimations: Timeline[] = [];

  useGSAP((context, contextSafe) => {
    const wh = mapContainerRef.current!.clientHeight;
    const speed = 20;
    const scrollDist = wh * speed;
    const scrollEnd = wh * (speed - 1);

    gsap.set('#scrollDist', {width: '100%', height: scrollDist});
    gsap.set('#container', {
      position: 'fixed',
      width: mapConfig.map.width,
      height: mapConfig.map.height,
      transformOrigin: '0 0',
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
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
        }
      })
      .to('#ship', {
        motionPath: {
          path: '#path',
          align: '#path',
          alignOrigin: [0.5, 0.5],
        },
      }, 0);

    const onSelectIsland = contextSafe!((islandId) => {
      islandSelectAnimations[islandId].play(0);
      setSelectedIsland(islandId);
    });

    const onUnselectIsland = contextSafe!((islandId) => {
      islandSelectAnimations[islandId].pause();
      gsap.to(islandRefs[islandId], { y: 0, ease: 'bounce.out', duration: 0.75 });
      setSelectedIsland(null);
    });

    islandRefs.forEach((island, index) => {
      const { start, end} = mapConfig.islands[index];
      const selectAnimation = gsap
        .timeline({defaults: {duration: 0.5}})
        .to(island, { y: -30, ease: 'power1.out' })
        .to(island, { y: 0, ease: 'power1.in' });

      selectAnimation.pause();
      selectAnimation.repeat(-1);
      islandSelectAnimations[index] = selectAnimation;

      main
        .set(island, {
          onComplete: () => onSelectIsland(index),
          onReverseComplete: () => onUnselectIsland(index),
        }, start)
        .set(island, {
          onComplete: () => onUnselectIsland(index),
          onReverseComplete: () => onSelectIsland(index),
        }, end);
    });


    const pos = {x: -mapConfig.map.width / 2, y: -mapConfig.map.height / 2};
    const xSet = gsap.quickSetter('#container', 'x', 'px');
    const ySet = gsap.quickSetter('#container', 'y', 'px');

    gsap.ticker.add(contextSafe!(() => {
      pos.x += (-gsap.getProperty('#ship', 'x') - pos.x);
      pos.y += (-gsap.getProperty('#ship', 'y') - pos.y);
      xSet(pos.x);
      ySet(pos.y);
    }));

    window.onresize = contextSafe!(() => {
      gsap.set('#container', {left: window.innerWidth / 2, top: window.innerHeight / 2});
    });

    // For debugging animation
    GSDevTools.create({animation: main})
  }, {scope: mapContainerRef});

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
            strokeWidth='10'
          />
          <g>
            {mapConfig.islands.map((islandConfig, index) => (
              <image
                key={index}
                ref={e => {islandRefs[index] = e;}}
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

export default GaspMap;
