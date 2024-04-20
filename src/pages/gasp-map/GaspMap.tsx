import { useRef } from 'react';
import { gsap, toArray } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import './GaspMap.css';
import { GSDevTools } from 'gsap-trial/GSDevTools';

function GaspMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<SVGSVGElement | null>(null);

  useGSAP(() => {
    const wh = mapContainerRef.current!.clientHeight;
    const speed = 20;
    const scrollDist = wh * speed;
    const scrollEnd = wh * (speed - 1);
    const mapWidth = mapRef.current!.getBoundingClientRect().width;
    const mapHeight = mapRef.current!.getBoundingClientRect().height;
    const stops = toArray<SVGRect>("rect");

    gsap.set('#scrollDist', {width: '100%', height: scrollDist})
    gsap.set('#container', {
      position: 'fixed',
      width: mapWidth,
      height: mapHeight,
      transformOrigin: '0 0',
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 1
    })

    //tween the svg path + circle
    const main = gsap.timeline({
      defaults: {duration: 1, ease: 'none'},
      scrollTrigger: {
        trigger: '#scrollDist',
        start: 'top top',
        end: '+=' + scrollEnd,
        scrub: 0.3,
        scroller: mapContainerRef.current,
        onUpdate: ({progress}) => console.log(progress) //  info for position
      }
    })
      .to('#point', {
        motionPath: {
          path: "#path",
          align: "#path",
          alignOrigin: [0.5, 0.5],
          //autoRotate: true,
        },
      }, 0)
      //.from('#path', {drawSVG: '0 0'}, 0.006)
      .set(stops[0], {fill: "red"}, 0.06)
      .set(stops[1], {fill: "red"}, 0.18)
      .set(stops[2], {fill: "red"}, 0.30)
      .set(stops[3], {fill: "red"}, 0.35)
      .set('#finish', {autoAlpha: 1}, 0.998)
      .set('#point', {scale: 1.5}, 1)

    //move container to follow circle
    let povDelay = 1, // 1 = no delay
      pos = {x: -mapWidth / 2, y: -mapHeight / 2},
      //pos = { x:-800, y:-450 },
      xSet = gsap.quickSetter('#container', "x", "px"),
      ySet = gsap.quickSetter('#container', "y", "px");

    gsap.ticker.add(() => {
      pos.x += (-gsap.getProperty('#point', 'x') - pos.x) * povDelay;
      pos.y += (-gsap.getProperty('#point', 'y') - pos.y) * povDelay;
      xSet(pos.x);
      ySet(pos.y);
    });

    // For debugging animation
    // GSDevTools.create({animation: main})
  }, {scope: mapContainerRef});

  return (
    <div className='map-container' ref={mapContainerRef}>
      <div id="scrollDist"></div>
      <div id="container">
        <svg id="map" ref={mapRef} width="1600" height="900">
          <path id="path"
                d="M799 451s158.066-224.136 225-195c85 37 270.79 108.09 348 70 75-37-5-79 14-159 .98-4.128 71-123 134-15 53.83 92.279 16 253 8 267s-109.31 168.763-79 242c24 58 76 114-9 145s-152-25-177-62-55.06-66.563-109-85c-79-27-209.732-5.869-246 64-68 131-197.119 14.917-331 38-377 65-248-54-274-164s4-196-168-178c-29.804 3.119-175-94-72-151s66-252 193-105 194.215 201.228 244 143c171-200 299 145 299 145z"
                fill="none" stroke="#676767"
                strokeWidth="10"
          />

          <g fill="#585858">
            <rect x="980" y="180" width="58" height="48"/>
            <rect x="1350" y="90" width="40" height="39"/>
            <rect x="1380" y="530" width="49" height="48"/>
            <rect x="1400" y="750" width="50" height="27"/>
            <rect x="1060" y="590" width="62" height="33"/>
            <rect x="780" y="720" width="58" height="39"/>
            <rect x="350" y="720" width="53" height="33"/>
            <rect x="190" y="460" width="50" height="53"/>
            <rect x="130" y="50" width="75" height="35"/>
            <rect x="440" y="380" width="65" height="65"/>
          </g>

          <g id="point">
            <circle cx="800" cy="450" r="20" fill="green"/>
            <circle className="eye" cx="795" cy="445" r="3" fill="grey"/>
            <circle className="eye01" cx="805" cy="445" r="3" fill="grey"/>
            <path d="M 790 455 Q 796 465 810 455" fill="none" stroke="grey" strokeWidth="3"/>
          </g>

          <text id="finish" x="850" y="470">You did it ...</text>

        </svg>

      </div>
    </div>
  );
}

export default GaspMap;
