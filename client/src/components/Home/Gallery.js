import React from 'react';
import Masonry from 'react-mason';
import GalleryStyles from './Gallery.style';

const Gallery = ({ elements }) => {
  const classes = GalleryStyles();

  const artwork = elements.map((element, index) => {
    console.log(element);
    return (
      <div key={index} className={classes.artworkContainer}>
        <img src={element.current.cover} />
      </div>
    );
  });

  return <Masonry>{artwork}</Masonry>;
};

export default Gallery;
