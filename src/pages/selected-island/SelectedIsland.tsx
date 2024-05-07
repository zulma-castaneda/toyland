import { useSearchParams } from "react-router-dom";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import "./PuzzlesIsland.css";
import { PuzzlesIsland } from "./PuzlessIsland";
import { DollsIsland } from "./DollsIsland";

function SelectedIsland() {
  const [searchParams] = useSearchParams();
  const currentIsland = parseInt(searchParams.get("islandId") || "");
  console.log(currentIsland);

  return (
    <div>
      {currentIsland === 0 && <PuzzlesIsland />}
      {currentIsland === 1 && <DollsIsland />}
    </div>
  );
}

export default SelectedIsland;
