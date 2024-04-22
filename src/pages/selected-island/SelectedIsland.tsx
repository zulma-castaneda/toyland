import { useSearchParams } from 'react-router-dom';

function SelectedIsland() {
  const [searchParams] = useSearchParams();
  return (
    <div>Selected island: {searchParams.get('islandId')}</div>
  );
}

export default SelectedIsland;
