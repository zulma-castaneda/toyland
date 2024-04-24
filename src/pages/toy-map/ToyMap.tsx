import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import './ToyMap.css';
import { GSDevTools } from 'gsap-trial/GSDevTools';
import { mapConfig } from './map-config.ts';
import { useNavigate } from 'react-router-dom';
import { Introduction } from '../introduction/Introduction.tsx';

type Timeline = ReturnType<typeof gsap.timeline>;

export function ToyMap() {
  const navigate = useNavigate();
  const [selectedIsland, setSelectedIsland] = useState<null | number>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);
  const islandRefs = Array.from({length: mapConfig.islands.length}, () => useRef<SVGImageElement | null>(null));
  const islandSelectAnimations: Timeline[] = [];
  const ww = useRef(window.innerWidth);
  const wh = useRef(window.innerHeight);

  useGSAP((_, contextSafe) => {
    const speed = 20;
    const scrollDist = wh.current * speed;
    const scrollEnd = wh.current * (speed - 1);
    let flippedX = false;
    let flippedY = false;

    const updateShipOrientation = (scrollTrigger: ScrollTrigger) => {
      const rotation = gsap.getProperty('#ship', 'rotation') as number;
      const flipY = Math.abs(rotation) > 110;
      const flipX = scrollTrigger.direction === 1;

      if (flipY !== flippedY || flipX !== flippedX) {
        gsap.to('#ship', {scaleY: flipY ? -1 : 1, scaleX: flipX ? 1 : -1, duration: 0.25});
        flippedY = flipY;
        flippedX = flipX;
      }
    };

    const onSelectIsland = (islandId: number) => {
      islandSelectAnimations[islandId].play(0);
      setSelectedIsland(islandId);
    };

    const onUnselectIsland = (islandId: number) => {
      islandSelectAnimations[islandId].pause();
      gsap.to(islandRefs[islandId].current, { y: 0, ease: 'bounce.out', duration: 0.75 });
      setSelectedIsland(null);
    };

    const generateIslandsSelectors = (timeline: Timeline) => {
      islandRefs.forEach((island, index) => {
        const { start, end} = mapConfig.islands[index];
        const selectAnimation = gsap
          .timeline({defaults: {duration: 0.5}})
          .to(island.current, { y: -30, ease: 'power1.out' })
          .to(island.current, { y: 0, ease: 'power1.in' });

        selectAnimation.pause();
        selectAnimation.repeat(-1);
        islandSelectAnimations[index] = selectAnimation;

        timeline.set(island.current, {
          onComplete: contextSafe!(() => onSelectIsland(index)),
          onReverseComplete: contextSafe!(() => onUnselectIsland(index)),
        }, start);

        timeline.set(island.current, {
          onComplete: contextSafe!(() => onUnselectIsland(index)),
          onReverseComplete: contextSafe!(() => onSelectIsland(index)),
        }, end);
      });
    };

    const onResize = () => {
      gsap.set('#container', {
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
      });
    };

    gsap.set('#scrollDist', {width: '100%', height: scrollDist});
    gsap.set('#container', {
      width: mapConfig.map.width,
      height: mapConfig.map.height,
      left: ww.current / 2,
      top: wh.current / 2,
    });

    const mainTimeline = gsap
      .timeline({
        defaults: {duration: 10, ease: 'none'},
        scrollTrigger: {
          trigger: '#scrollDist',
          start: 'top top',
          end: '+=' + scrollEnd,
          scrub: true,
          scroller: mapContainerRef.current,
          onUpdate: contextSafe!(updateShipOrientation),
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

    mainTimeline.seek(0.001);

    generateIslandsSelectors(mainTimeline);
    window.onresize = contextSafe!(onResize);

    // For debugging animation
    if(import.meta.env.DEV) {
      GSDevTools.create({animation: mainTimeline});
    }
  }, {scope: mapContainerRef});

  useEffect(() => {
    const pos = {x: -mapConfig.map.width / 2, y: -mapConfig.map.height / 2};
    const xSet = gsap.quickSetter('#map', 'x', 'px');
    const ySet = gsap.quickSetter('#map', 'y', 'px');

    function updateMapPosition() {
      pos.x += (-gsap.getProperty('#ship', 'x') - pos.x);
      pos.y += (-gsap.getProperty('#ship', 'y') - pos.y);
      xSet(pos.x);
      ySet(pos.y);
    }

    gsap.ticker.add(updateMapPosition);

    return () => gsap.ticker.remove(updateMapPosition);
  }, []);

  useEffect(() => {
    const currentScroll = window.sessionStorage.getItem('currentScroll');
    const parsedScroll = Number(currentScroll);
    if(!isNaN(parsedScroll)) {
      mapContainerRef.current?.scroll(0, parsedScroll);
    }
  }, []);

  const onClick = () => {
    if(selectedIsland !== null) {
      const currentScroll = mapContainerRef.current?.scrollTop;
      window.sessionStorage.setItem('currentScroll', currentScroll?.toString() || '0');
      navigate(`/selected-island?islandId=${selectedIsland}`);
    }
  };

  return (
    <div className='map-container' ref={mapContainerRef} onClick={onClick}>
      <Introduction/>
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
