import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ITuit } from '../../interfaces/ITuit';
// @ts-ignore
import { createTuitThunk } from '../../redux/tuitSlice';
import TuitImage from '../TuitImage/TuitImage';
import TuitImageUpload from './TuitImageUpload';
import { getAuthUser } from '../../redux/userSlice';

/**
 * Displays form where user can submit a new tuit.
 *
 */
const CreateTuit = () => {
  const authUser = useAppSelector(getAuthUser);
  const userId = authUser.id;
  const dispatch = useAppDispatch();
  const [tuit, setTuit] = React.useState<ITuit>({
    id: '',
    author: authUser,
    createdAt: '',
    tuit: '',
    image: '',
    imageFile: undefined,
  });

  const createTuit = async (tuit: ITuit) => {
    if (!tuit) return;
    dispatch(createTuitThunk({ userId, tuit }));
    setTuit({ ...tuit, tuit: '', image: '', hashtags: [] });
  };

  const parseHashtags = (tuit: string): string[] | null => {
    return tuit.toLowerCase().match(/\B(\#[a-zA-Z]+\b)(?!;)/g);
  };

  const handleTuitInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tuitContent: string = e.target.value;
    const updatedTuit = { ...tuit, tuit: tuitContent };
    const hashtags = parseHashtags(tuitContent);

    if (hashtags) {
      updatedTuit.hashtags = hashtags;
    } else {
      updatedTuit.hashtags = [];
    }
    setTuit({ ...updatedTuit });
  };

  return (
    <div className='p-2 w-100'>
      <textarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleTuitInput(e)
        }
        placeholder="What's happening?"
        className='w-100 border-0 p-2'
        value={tuit.tuit}
      ></textarea>
      {tuit.hashtags && (
        <div>
          {tuit.hashtags.map((hashtag, index) => (
            <span
              key={index}
              className='text-primary fw-bold fs-5'
              style={{ cursor: 'pointer' }}
            >
              {hashtag}{' '}
            </span>
          ))}
        </div>
      )}
      {tuit.image && <TuitImage imageURL={tuit.image} deletable={true} />}
      <div className='row'>
        <div className='col-10 ttr-font-size-150pc text-primary mt-4'>
          <TuitImageUpload tuit={tuit} setTuit={setTuit} />
          {/* <i className='fas fa-image me-3'></i> */}
          {/* <i className='far fa-gif me-3'></i>
          <i className='far fa-bar-chart me-3'></i>
          <i className='far fa-face-smile me-3'></i>
          <i className='far fa-calendar me-3'></i>
          <i className='far fa-map-location me-3'></i> */}
        </div>
        <div className='col-2 mt-4'>
          <button
            onClick={() => createTuit(tuit)}
            className={`btn btn-primary rounded-pill fa-pull-right
                                  fw-bold ps-4 pe-4`}
          >
            Tuit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTuit;
