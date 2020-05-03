import React, { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

const UploadInput = ({ name, setFieldValue }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setFieldValue(name, acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default UploadInput;
