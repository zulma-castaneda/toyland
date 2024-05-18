import { ChangeEvent, useState } from "react";
import { JigsawPuzzle } from "./jigsaw-puzzle/jigsaw-puzzle";
import puzzleImage from "../../../public/victorian-puzzle.jpg"

export const PuzzlesIsland = () => {
  const [pieceCount, setpieceCount] = useState(3);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isJigsaePuzzleSolved, setIsJigsaePuzzleSolved] =
    useState<boolean>(false);

  const toggleSwitch = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
  };

  const handleDificultyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setpieceCount(parseInt(e.target.value));
    setIsJigsaePuzzleSolved(false);
  };
  return (
    <div className="puzzles-island ">
      <div className="container">
        <h2 className="header header-title">
          Bienvenidos a la Isla de los Rompecabezas
        </h2>
        <div className="two-col-container">
          <div className="img-two-col">
            <figure>
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Spilsbury_jigsaw_-_John_Spilsbury%2C_1766_-_BL.jpg"></img>

              <figcaption>
                "Europa dividida en sus reinos, etc." (1766) Se cree que es el
                primer rompecabezas hecho a propósito.
              </figcaption>
            </figure>
          </div>
          <div className="text-two-col">
            <h3>Un Poco de Historia</h3>
            <p>
              Hace mucho tiempo, un señor llamado John Spilsbury inventó algo
              muy especial: ¡los rompecabezas! Pero no eran como los que
              conocemos hoy en día. En lugar de estar hechos de cartón, los
              primeros rompecabezas eran de madera y se llamaban “Mapas
              Desglosados”. ¿Sabes por qué? Porque estaban hechos a partir de
              mapas reales, y la gente los usaba para aprender geografía. 🌍
              <br />
              <br />
              La idea era simple: tomaban un mapa, lo pegaban en una tabla de
              madera y luego lo cortaban en pedazos con una sierra siguiendo las
              fronteras de los países. Así, los niños podían armar el mapa como
              un rompecabezas y aprender sobre diferentes lugares del mundo. 🗺️
            </p>
          </div>
        </div>
        <hr />
        <div className="two-col-container">
          <div className="text-two-col">
            <p>
              En el siglo XX, los rompecabezas se volvieron muy famosos. Eran
              como obras de arte en pedacitos de madera. La gente de la alta
              sociedad los amaba. Pero, ¿sabes qué? No tenían una imagen que
              mostrara cómo encajar las piezas. ¡Los montadores tenían que usar
              su ingenio y resolver el enigma! Cada pieza encajaba de forma
              sutil, sin guías. ¡Imagina la concentración que se necesitaba! Un
              estornudo podía arruinar todo el trabajo. Así que, paso a paso,
              iban descubriendo la obra de arte oculta. ¡Y al final, se sentían
              muy satisfechos!
            </p>
          </div>
          <div className="img-two-col">
            <figure>
              <img src="https://www.oldpuzzles.com/files/styles/large/public/examples/1362_1.jpg?itok=XZYs51fz"></img>

              <figcaption>
                Este rompecabezas está hecho de madera contrachapada y no tiene
                piezas que se entrelacen. El corte de las piezas sigue líneas
                rectas, combinando estilos del siglo XIX y la primera década del
                siglo XX.
              </figcaption>
            </figure>
          </div>
        </div>
        <h3 className="header">
          ¿Te animas a armar uno ahora? ¡Seguro que te divertirás! 🌟🧩
        </h3>
        <p>
          Aquí puedes ajustar las piezas del juego para que sea más fácil o más
          difícil. ¿Quieres desafiar tus habilidades y activar los bordes que se
          entrelazan como por arte de magia? ¡Adelante! ¿O prefieres resolverlo
          como lo hacían en tiempos antiguos, como en la época victoriana?
          ¡También es posible!
        </p>
        <label htmlFor="slider">Fácil</label>
        <input
          type="range"
          min="3"
          max="10"
          value={pieceCount}
          id="slider"
          onChange={handleDificultyChange}
        />
        <label htmlFor="slider">Difícil</label>
        <p>
          Cantidad de piezas:{" "}
          <span id="pieceCount">{pieceCount * pieceCount}</span>
        </p>
        <label className="switch">
          <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
          Activar bordes
        </label>
        <div className="puzzle-container">
          <JigsawPuzzle
            imageSrc={puzzleImage}
            rows={pieceCount}
            columns={pieceCount}
            onSolved={() => setIsJigsaePuzzleSolved(true)}
          />
        </div>
        {isJigsaePuzzleSolved && (
          <h3 className="header">Felicitaciones! lo lograste 🌟🧩</h3>
        )}
        <hr />
        <div className="two-col-container">
          <div className="img-two-col">
            <figure>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/15-puzzle-02.jpg/1200px-15-puzzle-02.jpg"></img>
              <figcaption>
                El Rompecabezas de 15 es un juego deslizante con 15 cuadrados
                numerados del 1 al 15 en un marco de 4x4. El objetivo es mover
                los cuadrados para ordenarlos numéricamente.
              </figcaption>
            </figure>
          </div>
          <div className="text-two-col">
            <p>
              Durante la Gran Depresión, uno de los tipos de rompecabezas más
              populares fueron los rompecabezas deslizantes. Estos desafiantes
              juegos consistían en mover piezas a lo largo de ciertas rutas en
              un tablero para lograr una configuración específica.
              <br />
              <br />
              Los rompecabezas deslizantes eran especialmente atractivos porque
              eran baratos, duraderos y se podían reciclar una y otra vez.
              Además, se volvieron más complejos y atrajeron tanto a niños como
              a adultos.
            </p>
          </div>
        </div>
        <p>
          🌟 Así que, la próxima vez que hagas un rompecabezas, recuerda que
          estás siguiendo una tradición de cientos de años ¡Diviértete armando
          las piezas! 🤗🧩
        </p>
        https://www.oldpuzzles.com/history-techniques-styles/jigsaw-puzzles-brief-history
      </div>
    </div>
  );
};
