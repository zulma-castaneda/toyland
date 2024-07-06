import { DollBuilder } from "../../components/DollBuilder/DollBuilder.tsx";
import { ColorfulText } from "../introduction/ColorfulText.tsx";
import { DollPlayground, Toy } from '../../components/DollPlayground/DollPlayground.tsx';
import { useEffect, useState } from 'react';

export const DollsIsland = () => {
  const [toys, setToys] = useState<Toy[]>([]);

  useEffect(() => {
    setToys([
      {
        id: self.crypto.randomUUID(),
        type: 'doll',
        head: 1,
        body: 2,
      },
      {
        id: self.crypto.randomUUID(),
        type: 'generic',
        variant: '1',
      },
    ]);
  }, []);

  const addDoll = () => {
    setToys(currentToys => {
      return [
        ...currentToys,
        {
          id: self.crypto.randomUUID(),
          type: 'doll',
          head: Math.floor(Math.random() * (3 - 1 + 1) + 1),
          body: Math.floor(Math.random() * (3 - 1 + 1) + 1),
        },
      ];
    });
  };

  return (
    <div className="puzzles-island ">
      <div className="container">
        <h2 className="header header-title bold-text">
          Bienvenidos a <ColorfulText text="la Isla de las Muñecas" />
        </h2>
        <section className="two-col-container">
          <p>
            ¡Hola, pequeños exploradores! Bienvenidos a la Isla de las Muñecas,
            un rincón encantado donde las muñecas cobran vida y nos cuentan sus
            historias.
          </p>
        </section>
        <section className="two-col-container">
          <div className="text-two-col">
            <h3 className="bold-text">Kokeshi</h3>
            <p>
              Las kokeshi son muñecas japonesas muy especiales que se crearon
              hace mucho tiempo en las montañas de Japón. Al principio, las
              personas las hacían para venderlas a los visitantes de los baños
              termales. ¡Imagínate a los visitantes relajándose en el agua
              caliente y llevándose a casa una kokeshi como recuerdo!
              <br /> Aunque el origen de su nombre es un misterio, las kokeshi
              son adorables y únicas, con diferentes estilos y siempre con una
              sonrisa amigable.
            </p>
          </div>
          <div className="img-two-col">
            <figure>
              <img src="https://vivetokio.com/wp-content/uploads/2020/12/munecas-kokeshi-comprar-1024x576.jpg"></img>

              <figcaption>Muñecas kokeshi modernas.</figcaption>
            </figure>
          </div>
        </section>
        <hr />
        <h3 className="bold-text header">Animate a armar tu propia Kokeshi</h3>
        <DollBuilder />

        <section className="two-col-container">
          <div className="img-two-col">
            <figure>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/First_matryoshka_museum_doll_open.jpg"></img>

              <figcaption>Las primeras Matryoshkas creadas.</figcaption>
            </figure>
          </div>
          <div className="text-two-col">
            <h2 className="bold-text">Matryoshkas</h2>
            <p>
              Hace mucho tiempo, en 1890, dos talentosos artistas rusos, Vasily
              Zvyozdochkin y Sergey Malyutin, crearon algo mágico: las
              matryoshkas. 🎨 ¿Qué son exactamente? Bueno, imagina una muñeca
              dentro de otra muñeca, dentro de otra muñeca... <br />
              El conjunto original tenía ocho muñecas. La más grande era una
              madre con un vestido tradicional, sosteniendo un gallo rojo en la
              mano. Dentro de ella, había más muñecas: sus hijos y en el centro,
              un bebé adorable. Pero aquí viene lo interesante: nadie sabe
              exactamente de dónde vino la idea. Algunos dicen que los artistas
              se inspiraron en la cultura asiática, como las Kokeshi de Japón.
              <br />
              Estas muñecas se hicieron famosas en todo el mundo cuando la
              esposa de Savva Mamontov las llevó a la Exposición Universal de
              París en 1900, ¡y ganaron una medalla de bronce! Desde entonces,
              las matryoshkas se fabrican en muchas partes de Rusia y son un
              popular souvenir. Así que la próxima vez que veas una, ¡recuerda
              su historia y disfruta de su magia! 🌟🇷🇺
            </p>
          </div>
        </section>
      </div>
      <DollBuilder/>
      <button onClick={addDoll}>Agregar muñeca aleatoria</button>
      <DollPlayground toys={toys} />
    </div>
  );
};
