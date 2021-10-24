import { admin } from "../config/secret";
import { ArtworkVisibility } from "../entities/Artwork";
import { OrderStatus, OrderType } from "../entities/Order";
import {
  VersionAvailability,
  VersionLicense,
  VersionType,
  VersionUse,
} from "../entities/Version";

const general = {
  id: "",
  ownerId: "",
  currentId: "",
  active: true,
  visibility: ArtworkVisibility.visible,
  generated: true,
};

const version = {
  availability: VersionAvailability.available,
  type: VersionType.unavailable,
  license: VersionLicense.unavailable,
  use: VersionUse.unavailable,
  personal: "0",
  commercial: "0",
};

const artwork = [
  {
    general: {
      ...general,
      active: false,
    },
    details: {
      title: "Inactive",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
      visibility: ArtworkVisibility.invisible,
    },
    details: {
      title: "Invisible",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Preview only",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636389.png",
      width: "1920",
      height: "1920",
      dominant: "#E37324",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636389.png",
      width: "640",
      height: "640",
      dominant: "#E37324",
      orientation: "square",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Free but personal",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.free,
      license: VersionLicense.personal,
      use: VersionUse.unavailable,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636390.png",
      width: "1920",
      height: "1352",
      dominant: "#040404",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636390.png",
      width: "640",
      height: "451",
      dominant: "#040404",
      orientation: "landscape",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Free but commercial (included)",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.free,
      license: VersionLicense.commercial,
      use: VersionUse.included,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Free but commercial (separate)",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.free,
      license: VersionLicense.commercial,
      use: VersionUse.separate,
      commercial: 20,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Commercial but personal",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.commercial,
      license: VersionLicense.personal,
      use: VersionUse.unavailable,
      personal: 10,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636393.png",
      width: "1761",
      height: "1920",
      dominant: "#ADDCDE",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636393.png",
      width: "640",
      height: "698",
      dominant: "#ADDCDE",
      orientation: "portrait",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Commercial but commercial (included)",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.commercial,
      license: VersionLicense.commercial,
      use: VersionUse.included,
      personal: 10,
      commercial: 10,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Commercial but commercial (separate)",
      description: "",
      ...version,
      availability: VersionAvailability.available,
      type: VersionType.commercial,
      license: VersionLicense.commercial,
      use: VersionUse.separate,
      personal: 10,
      commercial: 20,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636395.png",
      width: "1920",
      height: "1920",
      dominant: "#E3C3DB",
      orientation: "square",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636395.png",
      width: "640",
      height: "640",
      dominant: "#E3C3DB",
      orientation: "square",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Has comments",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [
      {
        id: "",
        ownerId: "",
        artworkId: "",
        content: "Test comment 1",
        modified: false,
        generated: false,
      },
      {
        id: "",
        ownerId: "",
        artworkId: "",
        content: "Test comment 2",
        modified: true,
        generated: false,
      },
    ],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Has favorites",
      description: "",
      ...version,
    },
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
    favorites: [
      {
        id: "",
        ownerId: "",
        artworkId: "",
      },
    ],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "GEISHA",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636398.png",
      width: "1389",
      height: "1920",
      dominant: "#040404",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636398.png",
      width: "640",
      height: "885",
      dominant: "#040404",
      orientation: "portrait",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "moonlight howl",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "amalgamation",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Halloween",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Good catch",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636402.png",
      width: "1281",
      height: "1920",
      dominant: "#227593",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636402.png",
      width: "640",
      height: "959",
      dominant: "#227593",
      orientation: "portrait",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "moonhole",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Sunset",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Beacon of Light",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "MYSTIC NIGHT",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "monke",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636407.png",
      width: "1920",
      height: "1887",
      dominant: "#367CBA",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636407.png",
      width: "640",
      height: "629",
      dominant: "#367CBA",
      orientation: "landscape",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Daydreaming",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Colourful",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Independence",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636410.png",
      width: "1435",
      height: "1920",
      dominant: "#F53839",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636410.png",
      width: "640",
      height: "856",
      dominant: "#F53839",
      orientation: "portrait",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "pspspspspspspspspspsps",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "Revelation",
      description: "",
      ...version,
    },
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
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "I want you",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636413.png",
      width: "1915",
      height: "1920",
      dominant: "#FB3434",
      orientation: "portrait",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636413.png",
      width: "640",
      height: "642",
      dominant: "#FB3434",
      orientation: "portrait",
    },
    favorites: [{}],
    comments: [{}],
  },
  {
    general: {
      ...general,
    },
    details: {
      title: "swimming with the fishes",
      description: "",
      ...version,
    },
    media: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkMedia/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636414.png",
      width: "1920",
      height: "1224",
      dominant: "#040404",
      orientation: "landscape",
    },
    cover: {
      source:
        "https://vesper-testing.s3.eu-central-1.amazonaws.com/artworkCovers/6c5ce644-393c-4d69-ab46-8d7d00ac0a8b1627499636414.png",
      width: "640",
      height: "408",
      dominant: "#040404",
      orientation: "landscape",
    },
    favorites: [{}],
    comments: [{}],
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

const orders = [
  {
    details: {
      id: "",
      buyerId: "",
      sellerId: "",
      artworkId: "",
      versionId: "",
      licenseId: "",
      discountId: "",
      reviewId: "",
      intentId: "",
      spent: 0,
      earned: 0,
      fee: 0,
      type: OrderType.free,
      status: OrderStatus.completed,
    },
    license: {
      id: "",
      ownerId: "",
      sellerId: "",
      artworkId: "",
      fingerprint: "",
      assignee: "",
      assigneeIdentifier: "",
      assignor: "",
      assignorIdentifier: "",
      company: "",
      type: "",
      usage: "",
      active: true,
      price: 0,
    },
    review: {
      id: "",
      orderId: "",
      artworkId: "",
      reviewerId: "",
      revieweeId: "",
      rating: 5,
    },
  },
];

// $TODO MISSING STRIPE ID TESTS
export const entities = [
  {
    data: {
      id: "",
      email: "garmonbozia05@gmail.com",
      fullName: "Valid user",
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
        orientation: "",
        dominant: "",
        height: "",
        width: "",
        ...avatar,
      },
    },
    artwork: artwork.map((item) => ({
      data: {
        ...item.general,
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
          ...item.details,
        },
        media: {
          data: {
            id: "",
            source: "",
            orientation: "",
            dominant: "",
            height: "",
            width: "",
            ...item.media,
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
            ...item.cover,
          },
        },
      },
    })),
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test@test.com",
      fullName: "No display favorites",
      name: "noDisplayFavorites",
      password: admin.password,
      avatarId: null,
      description: "Just vibin'",
      country: "FR",
      businessAddress: "",
      displayFavorites: false,
      resetToken: "",
      jwtVersion: 0,
      stripeId: "",
      verificationToken: "",
      verified: true,
      active: true,
      generated: false,
    },
    avatar: {},
    // $TODO Split artwork
    artwork: artwork.map((item) => ({
      data: {
        ...item.general,
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
          ...item.details,
        },
        media: {
          data: {
            id: "",
            source: "",
            orientation: "",
            dominant: "",
            height: "",
            width: "",
            ...item.media,
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
            ...item.cover,
          },
        },
      },
    })),
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: null,
      fullName: "",
      name: null,
      password: "",
      avatarId: null,
      description: "",
      country: "",
      businessAddress: "",
      displayFavorites: false,
      resetToken: "",
      resetExpiry: null,
      jwtVersion: 0,
      stripeId: "",
      verificationToken: "",
      verificationExpiry: null,
      verified: false,
      active: false,
      generated: false,
      created: null,
      updated: null,
    },
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test2@test.com",
      fullName: "Valid Reset token",
      name: "validResetToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test3@test.com",
      fullName: "Invalid Reset token",
      name: "invalidResetToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test4@test.com",
      fullName: "Expired Reset token",
      name: "expiredResetToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test5@test.com",
      fullName: "Valid Verification token",
      name: "validVerificationToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test6@test.com",
      fullName: "Invalid Verification token",
      name: "invalidVerificationToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
  {
    data: {
      id: "",
      email: "test7@test.com",
      fullName: "Expired Verification token",
      name: "expiredVerificationToken",
      password: admin.password,
      avatarId: null,
      description: "",
      country: "US",
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
    avatar: {},
    artwork: [],
    notifications: [
      {
        id: "",
        receiverId: "",
        link: "",
        ref: "",
        type: "",
        read: false,
      },
    ],
  },
];
