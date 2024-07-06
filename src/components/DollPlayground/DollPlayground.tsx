import { useEffect, useRef } from 'react';
import {
  Bodies,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from 'matter-js';

import './DollPlayground.css';
import '../DollBuilder/DollBuilder.css';

export function DollPlayground() {
  const scene = useRef<HTMLDivElement>(null);
  const doll = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(Engine.create());
  const dollsScale = 0.5;

  useEffect(() => {
    // create engine
    const world = engine.current.world;
    const dollWidth = (doll.current?.offsetWidth ?? 0) * dollsScale;
    const dollHeight = (doll.current?.offsetHeight ?? 0) * dollsScale;

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

    const dollBody = Bodies.rectangle(300, 35, dollWidth, dollHeight, {
      density: 0.0005,
      frictionAir: 0.06,
      restitution: 0.3,
      friction: 0.01,
      render: { visible: false }
    });
    Composite.add(engine.current.world, [dollBody]);

    const onRender = () => {
      const {x, y} = dollBody.position;
      doll.current!.style.top = `${y - dollHeight}px`;
      doll.current!.style.left = `${x - dollWidth}px`;
      doll.current!.style.transform = `rotate(${dollBody.angle}rad)`;
    }

    Events.on(render, "afterRender", onRender);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Events.off(render, "afterRender", onRender);

      Composite.clear(engine.current.world, false, true)
      Engine.clear(engine.current);
      render.canvas.remove();
    }
  }, []);

  return (
    <div className='playground-container'>
      <div className='doll sprite sprite-1' style={{scale: String(dollsScale)}} ref={doll}></div>
      <div className='playground-scene' ref={scene}/>
    </div>
  );
}
