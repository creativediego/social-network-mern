import { useEffect, useState } from 'react';
import * as service from '../../services/likes-service';
import { AlertBox, Tuits } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { clearTuits, setTuits } from '../../redux/tuitSlice';

const MyLikes = ({ userId }) => {
  const dispatch = useDispatch();
  const tuits = useSelector((state) => state.tuits.list);
  const [error, setError] = useState();
  const findTuits = async () => {
    const res = await service.findAllTuitsLikedByUser(userId);
    if (res.error) {
      return setError(
        'We ran into an issue showing your liked tuits. Please try again later.'
      );
    }

    dispatch(setTuits(res));
  };
  useEffect(() => {
    dispatch(clearTuits());
    findTuits();
  }, []);

  return (
    <div>
      {error && <AlertBox message={error} />}
      {tuits && <Tuits tuits={tuits} />}
    </div>
  );
};

export default MyLikes;
