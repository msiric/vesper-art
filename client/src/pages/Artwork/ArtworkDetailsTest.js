import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import shallow from "zustand/shallow";
import { licenseValidation } from "../../../../common/validation";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import useOnScreen from "../../hooks/useOnScreen";
import globalStyles from "../../styles/global.js";

const ArtworkDetails = ({ match, location, socket }) => {
  const {
    artwork,
    favorites,
    license,
    fetchArtwork,
    fetchFavorites,
  } = useArtworkStore(
    (state) => ({
      artwork: state.artwork,
      favorites: state.favorites,
      license: state.license,
      fetchArtwork: state.fetchArtwork,
      fetchFavorites: state.fetchFavorites,
    }),
    shallow
  );
  const [userStore] = useUserContext();
  const commentsRef = useRef(null);
  const highlightRef = useRef(null);
  const isVisible = useOnScreen(commentsRef);
  const history = useHistory();
  const globalClasses = globalStyles();
  const { enqueueSnackbar } = useSnackbar();

  const query = queryString.parse(location.search);

  const setDefaultValues = () => ({
    licenseType: license,
    licenseAssignee: "",
    licenseCompany: "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(licenseValidation),
  });

  const scrollToHighlight = () => {
    if (highlightRef.current)
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const isSeller = () => userStore.id === artwork.owner.id;

  console.log("artwork", artwork, "favorites", favorites);

  useEffect(() => {
    const artworkId = match.params.id;
    /* if (isVisible) loadMoreComments() */
    Promise.all([fetchArtwork({ artworkId }), fetchFavorites({ artworkId })]);
  }, [location]);

  useEffect(() => {
    reset(setDefaultValues());
  }, [license]);

  return "test";
};

export default ArtworkDetails;
