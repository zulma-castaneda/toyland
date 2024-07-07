import './Slider.css'
import {useRef, ReactElement, createRef, useEffect, TouchEvent} from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/all';
import {debounceImmediate} from "../../utils.ts";

interface SliderProps {
  slideDuration?: number;
  wrap?: boolean;
  slides: ReactElement[];
  onChangeSlide: (index: number) => void;
}

// Based on https://codepen.io/GreenSock/pen/GRJwLNP
export function Slider(
  {
    slideDuration = 0.3,
    wrap = true,
    slides,
    onChangeSlide,
  }: SliderProps
) {
  const slidesRefs = useRef(slides.map(() => createRef<HTMLDivElement>()));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchstartX = useRef(0);
  const wrapWidth = useRef(0);
  const slideAnimation = useRef(gsap.to({}, {}));
  const animation = useRef(gsap.to({}, {}));
  const slideWidth = useRef(0);
  const proxy = useRef<HTMLDivElement | null>(null);
  const directionsCounter = useRef(0);
  const numSlides = slides.length;

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    const slideElements = slidesRefs.current.map(slideRef => slideRef.current);
    const wrapX = gsap.utils.wrap(-100, (numSlides - 1) * 100);

    animation.current = gsap.to(slideElements, {
      xPercent: '+=' + (numSlides * 100),
      duration: 1,
      ease: 'none',
      paused: true,
      repeat: -1,
      modifiers: {
        xPercent: wrapX
      }
    });

    gsap.set(slideElements, {
      xPercent: i => i * 100
    });
  }, { scope: containerRef });

  useEffect(() => {
    const containerReference = containerRef.current!;
    const observer = new ResizeObserver(onResize);

    observer.observe(containerReference);
    onResize();

    return () => {
      observer.unobserve(containerReference);
    };
  }, []);

  const onResize = contextSafe!(() => {
    const norm = (+gsap.getProperty(proxy.current, 'x') / wrapWidth.current) || 0;

    const slideHeight = slidesRefs.current[0].current?.offsetHeight ?? 0;
    slideWidth.current = slidesRefs.current[0].current?.offsetWidth ?? 0;
    wrapWidth.current = slideWidth.current * numSlides;

    gsap.set(proxy.current, {
      x: norm * wrapWidth.current,
    });

    gsap.set(containerRef.current, {
      height: slideHeight,
    });

    contextSafe!(() => animateSlides(0))();
    slideAnimation.current.progress(1);
  });

  const onPrevButtonClick = debounceImmediate(() => animateSlides(1), slideDuration * 1000);
  const onNextButtonClick = debounceImmediate(() => animateSlides(-1), slideDuration * 1000);
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => { touchstartX.current = e.changedTouches[0].screenX; };
  const onTouchEnd = debounceImmediate(contextSafe!((e: TouchEvent<HTMLDivElement>) => {
    const touchendX = e.changedTouches[0].screenX

    if (touchendX < touchstartX.current) {
      animateSlides(-1);
    }
    if (touchendX > touchstartX.current) {
      animateSlides(1);
    }
  }), slideDuration * 1000);

  const animateSlides = contextSafe!((direction: number) => {
    directionsCounter.current = directionsCounter.current  + (direction * -1);
    onChangeSlide(gsap.utils.wrap(0, numSlides)(directionsCounter.current));

    slideAnimation.current.kill();
    const x = snapX(+gsap.getProperty(proxy.current, 'x') + direction * slideWidth.current);

    slideAnimation.current = gsap.to(proxy.current, {
      x: x,
      duration: slideDuration,
      onUpdate: updateProgress
    });
  });

  const updateProgress = contextSafe!(() => {
    const progressWrap = gsap.utils.wrap(0, 1);
    animation.current.progress(progressWrap(+gsap.getProperty(proxy.current, 'x') / wrapWidth.current));
  });

  function snapX(value: number) {
    const snapped = gsap.utils.snap(slideWidth.current, value);
    return wrap ? snapped : gsap.utils.clamp(-slideWidth * (numSlides - 1), 0, snapped);
  }

  return (
    <div className='slides-container' onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} ref={containerRef}>
      <div ref={proxy}/>
      <div className='slides-inner'>
        {slides.map((content, index) => (
          <div className='slide' ref={slidesRefs.current[index]} key={index}>{content}</div>
        ))}
      </div>
      <button className='prevButton' onClick={onPrevButtonClick}>{'<'}</button>
      <button className='nextButton' onClick={onNextButtonClick}>{'>'}</button>
    </div>
  );
}
