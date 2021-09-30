import { admin } from "../config/secret";

export const entities = [
  {
    data: {
      id: "",
      email: "garmonbozia05@gmail.com",
      fullName: "Artista",
      name: admin.username,
      password: admin.password,
      avatarId: null,
      description: "Just vibin'",
      country: "HR",
      businessAddress: "",
      displayFavorites: true,
      resetToken: "",
      jwtVersion: 0,
      stripeId: "",
      verificationToken: "",
      verified: true,
      active: true,
      generated: false,
    },
    avatar: {
      data: {
        id: "",
        ownerId: "",
        source: "",
        orientation: "portrait",
        dominant: "",
        height: "",
        width: "",
      },
    },
    artwork: [
      {
        data: {
          id: "",
          ownerId: "",
          currentId: "",
          active: true,
          visibility: "visible",
          generated: true,
        },
        version: {
          data: {
            id: "",
            artworkId: "",
            title: "",
            description: "",
            availability: "",
            type: "",
            license: "",
            use: "",
            personal: "",
            commercial: "",
            coverId: "",
            mediaId: "",
          },
          media: {
            data: {
              id: "",
              source: "",
              orientation: "portrait",
              dominant: "",
              height: "",
              width: "",
            },
          },
          cover: {
            data: {
              id: "",
              source: "",
              orientation: "portrait",
              dominant: "",
              height: "",
              width: "",
            },
          },
        },
      },
    ],
  },
];
