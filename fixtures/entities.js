import { admin } from "../config/secret";

const artwork = [
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636387.jpg",
      width: "1920",
      height: "1920",
      dominant: "#8FA891",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636387.jpg",
      width: "640",
      height: "640",
      dominant: "#8FA891",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636388.jpg",
      width: "1920",
      height: "1920",
      dominant: "#DAD9DB",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636388.jpg",
      width: "640",
      height: "640",
      dominant: "#DAD9DB",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636389.jpg",
      width: "1920",
      height: "1920",
      dominant: "#E37324",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636389.jpg",
      width: "640",
      height: "640",
      dominant: "#E37324",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636390.jpg",
      width: "1920",
      height: "1352",
      dominant: "#040404",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636390.jpg",
      width: "640",
      height: "451",
      dominant: "#040404",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636391.jpg",
      width: "1491",
      height: "1920",
      dominant: "#C9A08B",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636391.jpg",
      width: "640",
      height: "824",
      dominant: "#C9A08B",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636392.jpg",
      width: "2000",
      height: "1175",
      dominant: "#21616B",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636392.jpg",
      width: "640",
      height: "376",
      dominant: "#21616B",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636393.jpg",
      width: "1761",
      height: "1920",
      dominant: "#ADDCDE",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636393.jpg",
      width: "640",
      height: "698",
      dominant: "#ADDCDE",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636394.jpg",
      width: "1920",
      height: "1496",
      dominant: "#27221D",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636394.jpg",
      width: "640",
      height: "499",
      dominant: "#27221D",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636395.jpg",
      width: "1920",
      height: "1920",
      dominant: "#E3C3DB",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636395.jpg",
      width: "640",
      height: "640",
      dominant: "#E3C3DB",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636396.jpg",
      width: "1920",
      height: "1920",
      dominant: "#0C060C",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636396.jpg",
      width: "640",
      height: "640",
      dominant: "#0C060C",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636397.jpg",
      width: "3300",
      height: "1860",
      dominant: "#CFCFD2",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636397.jpg",
      width: "640",
      height: "361",
      dominant: "#CFCFD2",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636398.jpg",
      width: "1389",
      height: "1920",
      dominant: "#040404",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636398.jpg",
      width: "640",
      height: "885",
      dominant: "#040404",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636399.jpg",
      width: "4919",
      height: "2763",
      dominant: "#083B82",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636399.jpg",
      width: "640",
      height: "359",
      dominant: "#083B82",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636400.jpg",
      width: "1360",
      height: "1920",
      dominant: "#E5DAD2",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636400.jpg",
      width: "640",
      height: "904",
      dominant: "#E5DAD2",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636401.jpg",
      width: "1920",
      height: "1920",
      dominant: "#261E1C",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636401.jpg",
      width: "640",
      height: "640",
      dominant: "#261E1C",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636402.jpg",
      width: "1281",
      height: "1920",
      dominant: "#227593",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636402.jpg",
      width: "640",
      height: "959",
      dominant: "#227593",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636403.jpg",
      width: "1920",
      height: "1920",
      dominant: "#040505",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636403.jpg",
      width: "640",
      height: "640",
      dominant: "#040505",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636404.jpg",
      width: "1357",
      height: "1920",
      dominant: "#FB6904",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636404.jpg",
      width: "640",
      height: "906",
      dominant: "#FB6904",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636405.jpg",
      width: "3000",
      height: "1875",
      dominant: "#2B323A",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636405.jpg",
      width: "640",
      height: "400",
      dominant: "#2B323A",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636406.jpg",
      width: "1381",
      height: "1920",
      dominant: "#494E58",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636406.jpg",
      width: "640",
      height: "890",
      dominant: "#494E58",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636407.jpg",
      width: "1920",
      height: "1887",
      dominant: "#367CBA",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636407.jpg",
      width: "640",
      height: "629",
      dominant: "#367CBA",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636408.jpg",
      width: "1920",
      height: "1224",
      dominant: "#040404",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636408.jpg",
      width: "640",
      height: "408",
      dominant: "#040404",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636409.jpg",
      width: "1535",
      height: "1920",
      dominant: "#3A3939",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636409.jpg",
      width: "640",
      height: "801",
      dominant: "#3A3939",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636410.jpg",
      width: "1435",
      height: "1920",
      dominant: "#F53839",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636410.jpg",
      width: "640",
      height: "856",
      dominant: "#F53839",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636411.jpg",
      width: "1920",
      height: "1920",
      dominant: "#D6A34F",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636411.jpg",
      width: "640",
      height: "640",
      dominant: "#D6A34F",
      orientation: "square",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636412.jpg",
      width: "3840",
      height: "2065",
      dominant: "#36154B",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636412.jpg",
      width: "640",
      height: "344",
      dominant: "#36154B",
      orientation: "landscape",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636413.jpg",
      width: "1915",
      height: "1920",
      dominant: "#FB3434",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636413.jpg",
      width: "640",
      height: "642",
      dominant: "#FB3434",
      orientation: "portrait",
    },
  },
  {
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636414.jpg",
      width: "1920",
      height: "1224",
      dominant: "#040404",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636414.jpg",
      width: "640",
      height: "408",
      dominant: "#040404",
      orientation: "landscape",
    },
  },
];

const avatar = {
  source:
    "https://vesper-testing.s3.eu-central-1.amazonaws.com/userMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636386.png",
  width: "898",
  height: "1280",
  dominant: "#B9B9B9",
  orientation: "portrait",
};

export const entities = [
  {
    data: {
      id: "",
      email: "garmonbozia05@gmail.com",
      fullName: "Artista",
      name: admin.username,
      password: admin.password,
      avatarId: "",
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
        orientation: "",
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
              orientation: "",
              dominant: "",
              height: "",
              width: "",
            },
          },
          cover: {
            data: {
              id: "",
              source: "",
              orientation: "",
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
