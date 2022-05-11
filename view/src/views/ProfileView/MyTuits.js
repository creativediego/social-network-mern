import { useEffect, useState } from 'react';
import * as service from '../../services/tuits-service';
import { Tuits, AlertBox } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { clearTuits, setTuits } from '../../redux/tuitSlice';

const MyTuits = ({ userId }) => {
  const dispatch = useDispatch();
  const tuits = useSelector((state) => state.tuits.list);
  const [error, setError] = useState();
  const findTuits = async () => {
    const res = await service.findTuitsByUser(userId);
    if (res.error) {
      return setError(
        'We ran into an issue showing your tuits. Please try again later.'
      );
    }
    dispatch(setTuits(res));
  };
  useEffect(() => {
    dispatch(clearTuits());
    findTuits();
  }, []);
  const deleteTuit = (tid) => service.deleteTuit(tid).then(findTuits);

  return (
    <div>
      {error && <AlertBox message={error} />}
      <Tuits tuits={tuits} deleteTuit={deleteTuit} />
    </div>
  );
};

export default MyTuits;
