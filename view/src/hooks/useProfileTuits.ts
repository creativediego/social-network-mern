import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setGlobalError } from '../redux/errorSlice';
import { ITuit } from '../interfaces/ITuit';

const useProfileTuits = (apiCall: () => Promise<any>): [ITuit[], boolean] => {
  const [tuits, setTuits] = useState<ITuit[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await apiCall();
      if (res.error) {
        dispatch(
          setGlobalError({
            message:
              'We ran into an issue showing the tuits. Please try again later.',
          })
        );
      }
      if (mounted) {
        setLoading(false);
        setTuits(res);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [tuits, loading];
};

export default useProfileTuits;
