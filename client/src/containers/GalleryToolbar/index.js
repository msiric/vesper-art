import React, { useEffect } from "react";
import DropdownItems from "../../components/DropdownItems/index";
import MainHeading from "../../components/MainHeading/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserGallery } from "../../contexts/local/userGallery";
import Box from "../../domain/Box";
import galleryToolbarStyles from "./styles";

const GalleryToolbar = ({ formatArtwork, location }) => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);

  const display = useUserGallery((state) => state.display);
  const loading = useUserGallery((state) => state[display].loading);
  const fetchUser = useUserGallery((state) => state.fetchUser);
  const changeSelection = useUserGallery((state) => state.changeSelection);

  const menuItems = [
    { value: "purchases", text: "Purchases" },
    { value: "artwork", text: "Artwork" },
  ];

  const classes = galleryToolbarStyles();

  useEffect(() => {
    fetchUser({ userId, userUsername, formatArtwork });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userUsername, location, display]);

  return (
    <Box className={classes.container}>
      <MainHeading text="Gallery" />
      <DropdownItems
        items={menuItems}
        loading={loading}
        label="Display"
        onChange={(e) => changeSelection({ selection: e.target.value })}
        value={display}
      />
    </Box>
  );
};

export default GalleryToolbar;
