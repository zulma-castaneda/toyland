import { createRef, RefObject, useEffect, useRef } from 'react';
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
};

const dollsScale = 0.3;
const defaultXPosition = 300;
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

  useEffect(() => {
    // create engine
    const world = engine.current.world;

    // create renderer
    const render = Render.create({
      element: scene.current!,
      engine: engine.current,
      options: {
        width: 800,
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
      Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
      Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
      Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
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
      max: { x: 800, y: 600 }
    });

    const onRender = () => {
      for (const { body, ref} of toysStorage.current.values()) {
        if(!body || !ref.current) { continue; }

        const {x, y} = body.position;
        const widthOffset = (ref.current.offsetWidth * (1 - dollsScale) / 2);
        const heightOffset = (ref.current.offsetHeight * (1 - dollsScale) / 2);
        const dollWidth = ref.current.offsetWidth * dollsScale;
        const dollHeight = ref.current.offsetHeight * dollsScale;

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

      Composite.clear(engine.current.world, false, true)
      Engine.clear(engine.current);
      render.canvas.remove();

      for (const [id, storedToy] of toysStorage.current) {
        toysStorage.current.set(id, {
          ...storedToy,
          body: undefined,
        });
      }
    }
  }, []);

  useEffect(() => {
    toys.forEach(toy => {
      const toyStored = toysStorage.current.get(toy.id);
      const toyRef = toyStored?.ref.current;
      const toyBody = toyStored?.body;
      if(!toyStored || !toyRef || toyBody) { return; }

      const dollWidth = toyRef.offsetWidth * dollsScale;
      const dollHeight = toyRef.offsetHeight * dollsScale;

      const dollBody = Bodies.rectangle(defaultXPosition, defaultYPosition, dollWidth, dollHeight, defaultBodyOptions);

      Composite.add(engine.current.world, [dollBody]);
      toyStored.body = dollBody;
      toysStorage.current.set(toy.id, toyStored);
    });
  }, [toys]);

  return (
    <div className='playground-container'>
      {
        toys.map(toy => {
          let storedToy = toysStorage.current.get(toy.id);

          if(!storedToy) {
            storedToy = { ref: createRef() };
            toysStorage.current.set(toy.id, storedToy);
          }

          switch (toy.type) {
            case 'doll':
              return (
                <div className='doll' key={toy.id} style={{scale: String(dollsScale)}} ref={storedToy.ref}>
                  <div className={`sprite sprite-${toy.head}`}/>
                  <div className={`sprite sprite-p${toy.body}`}/>
                </div>
              );
            case 'generic':
              return (
                <div key={toy.id} className='doll' style={{scale: String(dollsScale)}} ref={storedToy.ref}>
                  <div className={`sprite sprite-${toy.variant}`}/>
                </div>
              );
          }
        })
      }
      <div className='playground-scene' ref={scene}/>
    </div>
  );
}
