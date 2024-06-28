import "./Introduction.css";
import { ScrollIndicator } from "../../components/ScrollIndicator/ScrollIndicator";

export function Introduction() {
  return (
    <div className="intro">
      <div className="container">
        <div className="header">
          <h1 className="header-title">Juguetelandia</h1>
          <h2 className="header--subtitle">
            Una enciclopedia interactiva sobre juguetes
          </h2>
        </div>
        {/* <div>
          <p>
            En la decada del 2000, mi primer computador se convirtio en una
            ventana hacia un universo de conocimientos, gracias al emblemático
            software educativo de Encarta y las aventuras de Z multimedia. Las
            horas que pasé explorando estos programas, moldearon mi carrera y
            despertaron en mí una curiosidad que ahora me motiva a crear.
          </p>
          <p>
            Hoy, con Juguetelandia, quiero compartir un tributo a la pasión por
            el descubrimiento. No es solo un proyecto, es una invitación a
            explorar y aprender sobre los juguetes que marcaron generaciones.
          </p>
          <p>
            Mi deseo es que la tecnología sirva para enriquecer nuestro
            conocimiento, no para eclipsarlo. En tiempos donde el pensamiento
            crítico escasea y el entretenimiento superficial abunda,
            Juguetelandia es un espacio de inspiración y curiosidad. Porque si
            algo nos hace falta hoy en día, es más contenido que nos motive a
            buscar y aprender. Y si no lo encuentro, ¿por qué no crearlo yo
            misma?
          </p>
        </div> */}

        {/* <h2 className="chewy-regular">Descubre las Islas de Juguetelandia</h2> */}
        <p>
          Embárcate en un viaje por el archipiélago de Juguetelandia y sumérgete
          en las fascinantes historias que cada isla tiene para compartir
          contigo:
        </p>
        <ul>
          <li>
            <b className="chewy-regular">Isla de los Rompecabezas: </b>
            Esta isla es un gigantesco rompecabezas en sí misma, donde los
            caminos están formados por piezas de este entretenido juego. Aprende
            sobre el origen y la evolución de los rompecabezas a lo largo de los
            años. ¿Crees tener talento para resolverlos? ¡Ponte a prueba con
            algunos desafíos!
          </li>
          <div className="intro--img">
            <img src={"puzzle-island.png"} />
          </div>
          <br />
          <li>
            <b className="chewy-regular">Isla de las Muñecas: </b> Esta isla
            está habitada por muñecas de todo el mundo. Sumérgete en la historia
            y el origen de varios tipos de muñecas mientras juegas a crear las
            tuyas propias.
          </li>
          <div className="intro--img">
            <img src={"dolls-island.png"} />
          </div>
        </ul>

        <h2 className="chewy-regular">Interactúa con las Islas</h2>
        <p>
          <ol>
            <li>
              Desliza hacia arriba y observa cómo el barco comienza a moverse.
            </li>
            <li>
              Cuando te acerques a una isla, tocala para interactuar con ella y
              comenzar su actividad.
            </li>
            <li>Para volver a navegar regresa a la página anterior</li>
          </ol>
        </p>
        <ScrollIndicator />
      </div>
    </div>
  );
}
