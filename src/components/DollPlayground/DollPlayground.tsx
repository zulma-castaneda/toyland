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

export function DollPlayground() {
  const scene = useRef<HTMLDivElement>(null);
  const doll = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(Engine.create());

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

    Composite.add(world, [
      Bodies.rectangle(400, 600, 800, 20, { isStatic: true }),
      Bodies.rectangle(400, 0, 800, 20, { isStatic: true }),
      Bodies.rectangle(0, 300, 20, 600, { isStatic: true }),
      Bodies.rectangle(800, 300, 20, 600, { isStatic: true }),
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

    const dollBody = Bodies.rectangle(300, 35, 30, 30);
    Composite.add(engine.current.world, [dollBody]);

    const onRender = () => {
      const {x, y} = dollBody.position;
      doll.current!.style.top = `${y - 20}px`;
      doll.current!.style.left = `${x - 20}px`;
      doll.current!.style.transform = `rotate(${dollBody.angle}rad)`;
    }

    // Events.on(mouseConstraint, "mouseup", onClickWorld);
    Events.on(render, "afterRender", onRender);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Events.off(render, "afterRender", onRender);

      Render.stop(render)
      Composite.clear(engine.current.world, false, true)
      Engine.clear(engine.current);
      render.canvas.remove();
    }
  }, []);

  return (
    <div className='playground-container'>
      <div className='doll' ref={doll}>TEST</div>
      <div className='playground-scene' ref={scene}/>
    </div>
  );
}
