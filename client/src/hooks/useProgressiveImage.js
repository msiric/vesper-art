import { useEffect, useState } from "react";

export const useProgressiveImage = (source) => {
  const [state, setState] = useState({ downloaded: false });

  useEffect(() => {
    let image = new Image();
    image.src = source;
    image.onload = () => {
      setState({ downloaded: true });
      image.onload = null;
      image = null;
    };
  }, [source]);

  return state.downloaded;
};

export default useProgressiveImage;
