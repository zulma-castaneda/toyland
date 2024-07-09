import { createRef, RefObject, useEffect, useRef, useState } from 'react';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IChamferableBodyDefinition,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from 'matter-js';

import './DollPlayground.css';
import '../DollBuilder/DollBuilder.css';

export interface GenericToy {
  type: 'generic',
  variant: string,
}

export interface Doll {
  type: 'doll';
  head: number;
  body: number;
}

export type Toy = {
  id: string;
} & (Doll | GenericToy);

export interface DollPlaygroundProps {
  toys: Toy[];
}

type ToysStorage = {
  body?: Body,
  ref: RefObject<HTMLDivElement>,
  toy: Toy,
};

const dollsScale = 0.3;
const toyScale = 1;
const defaultYPosition = 35;
const defaultBodyOptions: IChamferableBodyDefinition = {
  density: 0.0005,
  frictionAir: 0.06,
  restitution: 0.3,
  friction: 0.01,
  render: { visible: false }
};

export function DollPlayground({ toys }: DollPlaygroundProps) {
  const scene = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(Engine.create());
  const toysStorage = useRef<Map<Toy['id'], ToysStorage>>(new Map());
  const [sceneWidth, setSceneWidth] = useState(0);

  useEffect(() => {
    const sceneRef = scene.current;
    if(!sceneRef) { return; }
    const observer = new ResizeObserver(() => {
      setSceneWidth(sceneRef.offsetWidth ?? 0);
    });
    observer.observe(sceneRef);

    return () => {
      observer.unobserve(sceneRef);
    };
  }, [scene]);

  useEffect(() => {
    // create engine
    const world = engine.current.world;

    // create renderer
    const render = Render.create({
      element: scene.current!,
      engine: engine.current,
      options: {
        width: sceneWidth,
        height: 600,
        wireframes: false,
        background: '#fff'
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine.current);

    // create walls

    const offset = 10;
    const options = { isStatic: true };

    Composite.add(world, [
      Bodies.rectangle(sceneWidth / 2, -offset, sceneWidth + 0.5 + 2 * offset, 50.5, options),
      Bodies.rectangle(sceneWidth / 2, 600 + offset, sceneWidth + 0.5 + 2 * offset, 50.5, options),
      Bodies.rectangle(sceneWidth + offset, 300, 50.5, 600.5 + 2 * offset, options),
      Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: sceneWidth, y: 600 }
    });

    const onRender = () => {
      for (const { body, ref, toy} of toysStorage.current.values()) {
        if(!body || !ref.current) { continue; }

        const scale = toy.type === "doll" ? dollsScale : toyScale;
        const {x, y} = body.position;
        const widthOffset = (ref.current.offsetWidth * (1 - scale) / 2);
        const heightOffset = (ref.current.offsetHeight * (1 - scale) / 2);
        const dollWidth = ref.current.offsetWidth * scale;
        const dollHeight = ref.current.offsetHeight * scale;

        ref.current.style.top = `${y - (dollHeight / 2) - (heightOffset)}px`;
        ref.current.style.left = `${x  - (dollWidth / 2) - (widthOffset)}px`;
        ref.current.style.transform = `rotate(${body.angle}rad)`;
      }
    };

    Events.on(render, "afterRender", onRender);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Events.off(render, "afterRender", onRender);

      Composite.clear(world, false, true)
      Engine.clear(engine.current);
      render.canvas.remove();

      for (const [id, storedToy] of toysStorage.current) {
        toysStorage.current.set(id, {
          ...storedToy,
          body: undefined,
        });
      }
    }
  }, [sceneWidth]);

  useEffect(() => {
    toys.forEach(toy => {
      const toyStored = toysStorage.current.get(toy.id);
      const toyRef = toyStored?.ref.current;
      const toyBody = toyStored?.body;
      if(!toyStored || !toyRef || toyBody) { return; }

      const scale = toy.type === "doll" ? dollsScale : toyScale;
      const dollWidth = toyRef.offsetWidth * scale;
      const dollHeight = toyRef.offsetHeight * scale;

      const dollBody = Bodies.rectangle(sceneWidth / 2, defaultYPosition, dollWidth, dollHeight, defaultBodyOptions);

      Composite.add(engine.current.world, [dollBody]);
      toyStored.body = dollBody;
      toysStorage.current.set(toy.id, toyStored);
    });

    for (const [id, storedToy] of toysStorage.current) {
      const foundToy = toys.find(toy => toy.id === id);

      if(!foundToy && storedToy.body) {
        Composite.remove(engine.current.world, storedToy.body);
      }
    }
  }, [toys, sceneWidth]);

  return (
    <div className='playground-container'>
      {
        toys.map(toy => {
          let storedToy = toysStorage.current.get(toy.id);

          if(!storedToy) {
            storedToy = { ref: createRef(), toy };
            toysStorage.current.set(toy.id, storedToy);
          }

          switch (toy.type) {
            case 'doll':
              return (
                <div className='toy' key={toy.id} style={{scale: String(dollsScale)}} ref={storedToy.ref}>
                  <div className={`sprite sprite-${toy.head}`}/>
                  <div className={`sprite sprite-B${toy.body}`}/>
                </div>
              );
            case 'generic':
              return (
                <div key={toy.id} className='toy' style={{scale: String(toyScale)}} ref={storedToy.ref}>
                  <div className={`furniture furniture-${toy.variant}`}/>
                </div>
              );
          }
        })
      }
      <div className='background'>
        <div className='wall'/>
        <div className='floor'/>
      </div>
      <div className='playground-scene' ref={scene}/>
    </div>
  );
}
