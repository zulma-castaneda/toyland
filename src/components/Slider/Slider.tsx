import './Slider.css'
import { useRef, ReactElement, createRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/all';

interface SliderProps {
  slideDuration?: number;
  wrap?: boolean;
  slides: ReactElement[];
}

// Based on https://codepen.io/GreenSock/pen/GRJwLNP
export function Slider(
  {
    slideDuration = 0.3,
    wrap = true,
    slides,
  }: SliderProps
) {
  const slidesRefs = useRef(slides.map(() => createRef<HTMLDivElement>()));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useGSAP((_, contextSafe) => {
    let slideWidth = 0;
    let wrapWidth = 0;
    const numSlides = slides.length;
    const proxy = document.createElement('div');
    const slideElements = slidesRefs.current.map(slideRef => slideRef.current);

    const progressWrap = gsap.utils.wrap(0, 1);
    let slideAnimation = gsap.to({}, {});
    const wrapX = gsap.utils.wrap(-100, (numSlides - 1) * 100);

    gsap.set(slideElements, {
      backgroundColor: 'random([red, blue, green, purple, orange, yellow, lime, pink])',
      xPercent: i => i * 100
    });

    const animation = gsap.to(slideElements, {
      xPercent: '+=' + (numSlides * 100),
      duration: 1,
      ease: 'none',
      paused: true,
      repeat: -1,
      modifiers: {
        xPercent: wrapX
      }
    });

    function updateProgress() {
      animation.progress(progressWrap(+gsap.getProperty(proxy, 'x') / wrapWidth));
    }

    function snapX(value: number) {
      const snapped = gsap.utils.snap(slideWidth, value);
      return wrap ? snapped : gsap.utils.clamp(-slideWidth * (numSlides - 1), 0, snapped);
    }

    function animateSlides(direction: number) {
      slideAnimation.kill();
      const x = snapX(+gsap.getProperty(proxy, 'x') + direction * slideWidth);

      slideAnimation = gsap.to(proxy, {
        x: x,
        duration: slideDuration,
        onUpdate: updateProgress
      });
    }

    function resize() {
      const norm = (+gsap.getProperty(proxy, 'x') / wrapWidth) || 0;

      slideWidth = slidesRefs.current[0].current?.offsetWidth ?? 0;
      wrapWidth = slideWidth * numSlides;

      gsap.set(proxy, {
        x: norm * wrapWidth
      });

      contextSafe!(() => animateSlides(0))();
      slideAnimation.progress(1);
    }

    prevButtonRef.current?.addEventListener('click', function() {
      contextSafe!(() => animateSlides(1))();
    });

    nextButtonRef.current?.addEventListener('click', function() {
      contextSafe!(() => animateSlides(-1))();
    });

    window.onresize = contextSafe!(resize);
    contextSafe!(resize)();
  }, { scope: containerRef });

  return (
    <div className='slides-container' ref={containerRef}>
      <div className='slides-inner'>
        {slides.map((content, index) => (
          <div className='slide' ref={slidesRefs.current[index]} key={index}>{content}</div>
        ))}
      </div>
      <button className='prevButton' ref={prevButtonRef}>{'<'}</button>
      <button className='nextButton' ref={nextButtonRef}>{'>'}</button>
    </div>
  );
}
