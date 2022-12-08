import { useEffect, useState } from "react";

export const useProgressiveImage = (source, onLoad = () => null) => {
  const [state, setState] = useState({ downloaded: false });

  useEffect(() => {
    let image = new Image();
    image.src = source;
    image.alt = source;
    image.onload = () => {
      onLoad({ source });
      setState({ downloaded: true });
      image.onload = null;
      image = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return state.downloaded;
};
