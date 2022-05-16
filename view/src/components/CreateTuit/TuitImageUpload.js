import React, { useEffect, useState } from 'react';
import TuitImage from '../Tuits/TuitImage';
import { uploadImage, uploadTuitImage } from '../../services/storage-service';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../../redux/errorSlice';

const TuitImageUpload = ({ tuit, setTuit }) => {
  const [tuitImageFile, setTuitImageFile] = useState('');
  const dispatch = useDispatch();
  const handleUploadImage = async () => {
    if (!tuitImageFile) return;
    try {
      const imageURL = URL.createObjectURL(tuitImageFile);
      setTuit({
        ...tuit,
        image: imageURL,
        imageFile: tuitImageFile,
      });
    } catch (err) {
      console.log(err);
      const message =
        'Sorry, we ran into an error uploading your tuit image. Login again, Try again later.';
      dispatch(setGlobalError({ error: message }));
    }
  };
  useEffect(() => {
    if (tuitImageFile) {
      handleUploadImage();
    }
  }, [tuitImageFile]);

  return (
    <div>
      <label htmlFor='tuitImageFile' alt='meadia' title='Media'>
        <i className='fas fa-image me-3' style={{ cursor: 'pointer' }}></i>
      </label>
      <input
        onChange={(e) => {
          setTuitImageFile(e.target.files[0]);
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
