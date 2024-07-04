import { useEffect, useRef } from 'react';
import {
  Bodies,
  Body,
  Composite,
  Composites,
  Constraint, Engine, Events, IMouseEvent,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
} from 'matter-js';

export function DollPlayground() {
  const scene = useRef<HTMLDivElement>(null);
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
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine.current);

    // add bodies
    const group = Body.nextGroup(true);

    const stack = Composites.stack(
      250,
      255,
      1,
      6,
      0,
      0,
      (x: number, y: number) => {
        return Bodies.rectangle(x, y, 30, 30);
      },
    );

    const catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

    Composite.add(world, [
      stack,
      catapult,
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(250, 555, 20, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),
      Bodies.circle(560, 100, 50, { density: 0.005 }),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0
      })
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

    const onClickWorld = (event: IMouseEvent<MouseConstraint>) => {
      const {x, y} = event.mouse.position;
      const ball = Bodies.circle(x, y, 10 + Math.random() * 30, {
        mass: 10,
        restitution: 0.9,
        friction: 0.005,
        render: {
          fillStyle: '#0000ff',
        },
      });
      Composite.add(engine.current.world, [ball]);
    }

    Events.on(mouseConstraint, "mouseup", onClickWorld);


    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Events.off(mouseConstraint, "mouseup", onClickWorld);

      Render.stop(render)
      Composite.clear(engine.current.world, false, true)
      Engine.clear(engine.current);
      render.canvas.remove();
      render.textures = {};
    }
  }, []);

  return (
    <div ref={scene} style={{width: '100%', height: '100%'}}/>
  );
}
