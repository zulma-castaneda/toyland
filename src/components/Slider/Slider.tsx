import './Slider.css'
import { useRef, ReactElement, createRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/all';

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
  const directionsCounter = useState(0);
  const slidesRefs = useRef(slides.map(() => createRef<HTMLDivElement>()));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useGSAP((_, contextSafe) => {
    let touchstartX = 0;
    let touchendX = 0;
    let slideWidth = 0;
    let slideHeight = 0;
    let wrapWidth = 0;
    const numSlides = slides.length;
    const proxy = document.createElement('div');
    const slideElements = slidesRefs.current.map(slideRef => slideRef.current);

    const progressWrap = gsap.utils.wrap(0, 1);
    let slideAnimation = gsap.to({}, {});
    const wrapX = gsap.utils.wrap(-100, (numSlides - 1) * 100);

    gsap.set(slideElements, {
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
      directionsCounter[1](counter => {
        const newDirectionCounter = counter + (direction * -1);
        onChangeSlide(gsap.utils.wrap(0, numSlides)(newDirectionCounter));

        return newDirectionCounter;
      });

      slideAnimation.kill();
      const x = snapX(+gsap.getProperty(proxy, 'x') + direction * slideWidth);

      slideAnimation = gsap.to(proxy, {
        x: x,
        duration: slideDuration,
        onUpdate: updateProgress
      });
    }

    function checkSwipeDirection() {
      if (touchendX < touchstartX) {
        animateSlides(-1);
      }
      if (touchendX > touchstartX) {
        animateSlides(1);
      }
    }

    function onResize() {
      const norm = (+gsap.getProperty(proxy, 'x') / wrapWidth) || 0;

      slideWidth = slidesRefs.current[0].current?.offsetWidth ?? 0;
      slideHeight = slidesRefs.current[0].current?.offsetHeight ?? 0;
      wrapWidth = slideWidth * numSlides;

      gsap.set(proxy, {
        x: norm * wrapWidth
      });

      gsap.set(containerRef.current, {
        height: slideHeight,
      });

      contextSafe!(() => animateSlides(0))();
      slideAnimation.progress(1);
    }


    const onPrevButtonClick = contextSafe!(() => animateSlides(1));
    const onNextButtonClick = contextSafe!(() => animateSlides(-1));
    const onTouchStart = (e: TouchEvent) => { touchstartX = e.changedTouches[0].screenX; };
    const onTouchEnd = contextSafe!((e: TouchEvent) => {
      touchendX = e.changedTouches[0].screenX;
      checkSwipeDirection();
    });

    prevButtonRef.current?.addEventListener('click', onPrevButtonClick);
    nextButtonRef.current?.addEventListener('click', onNextButtonClick);
    containerRef.current?.addEventListener('touchstart', onTouchStart);
    containerRef.current?.addEventListener('touchend', onTouchEnd);

    window.onresize = contextSafe!(onResize);
    contextSafe!(onResize)();

    return () => {
      prevButtonRef.current?.removeEventListener('click', onPrevButtonClick);
      nextButtonRef.current?.removeEventListener('click', onNextButtonClick);
      containerRef.current?.removeEventListener('touchstart', onTouchStart);
      containerRef.current?.removeEventListener('touchend', onTouchEnd);
    };
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
