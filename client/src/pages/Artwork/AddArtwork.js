/* import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../components/Store/Store.js";
import { deleteEmptyValues } from "../../utils/helpers.js";
import { postMedia, postArtwork } from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import AddArtworkForm from "../../components/Artwork/AddArtworkForm.js";

const AddArtwork = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    capabilities: {},
  });

  const fetchAccount = async () => {
    try {
      const { data } = await getUser({ stripeId: store.user.stripeId });
      setState({ ...state, loading: false, capabilities: data.capabilities });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    if (store.user.stripeId) fetchAccount();
  }, []);

  return (
    <AddArtworkForm
      capabilities={state.capabilities}
      user={store.user}
      postArtwork={postArtwork}
      postMedia={postMedia}
      deleteEmptyValues={deleteEmptyValues}
    />
  );
};

export default AddArtwork;
 */
