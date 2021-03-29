import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useLightbox } from "simple-react-lightbox";
import MainHeading from "../../components/MainHeading/index.js";
import { useUserStore } from "../../contexts/global/user";
import { useUserGallery } from "../../contexts/local/userGallery";

const GalleryToolbar = ({ formatArtwork, location }) => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);

  const display = useUserGallery((state) => state.display);
  const selection = useUserGallery((state) => state[display]);
  const index = useUserGallery((state) => state.index);
  const fetchUser = useUserGallery((state) => state.fetchUser);
  const changeSelection = useUserGallery((state) => state.changeSelection);

  const { openLightbox } = useLightbox();

  useEffect(() => {
    fetchUser({ userId, userUsername, formatArtwork });
  }, [location, display]);

  useEffect(() => {
    if (index !== null) openLightbox(index);
  }, [selection]);

  return (
    <Box style={{ height: "100%" }}>
      <MainHeading text="Gallery" />
      <FormControl variant="outlined" style={{ marginBottom: "12px" }}>
        <InputLabel id="data-display">Display</InputLabel>
        <Select
          labelId="data-display"
          value={display}
          onChange={changeSelection}
          label="Display"
          margin="dense"
        >
          <MenuItem value="purchases">Purchases</MenuItem>
          <MenuItem value="artwork">Artwork</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default GalleryToolbar;
