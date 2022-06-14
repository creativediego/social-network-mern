import * as React from 'react';
import { ITuit } from '../../interfaces/ITuit';

interface TuitImageUploadProps {
  tuit: ITuit;
  setTuit: React.Dispatch<React.SetStateAction<ITuit>>;
}

const TuitImageUpload: React.FC<TuitImageUploadProps> = ({
  tuit,
  setTuit,
}): JSX.Element => {
  const [tuitImageFile, setTuitImageFile] = React.useState<File | null>(null);
  const tuitRef = React.useRef(tuit);

  const handleSelectImage = React.useCallback(async () => {
    if (!tuitImageFile) return;
    const imageURL = URL.createObjectURL(tuitImageFile);
    setTuit({
      ...tuitRef.current,
      image: imageURL,
      imageFile: tuitImageFile,
    });
  }, [tuitImageFile, setTuit]);

  React.useEffect(() => {
    handleSelectImage();
  }, [handleSelectImage]);

  return (
    <div>
      <label htmlFor='tuitImageFile' title='Media'>
        <i className='fas fa-image me-3' style={{ cursor: 'pointer' }}></i>
      </label>
      <input
        onChange={(e) => {
          if (e.target.files) {
            setTuitImageFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
        type='file'
        style={{ display: 'none' }}
        id='tuitImageFile'
      />
    </div>
  );
};

export default TuitImageUpload;
