import { appName } from "@common/constants";
import fs from "fs";
import path from "path";
import { constructFullUrl } from "./helpers";

const dirname = path.resolve();

const OPEN_GRAPH_TAGS = {
  TYPE: "website",
  SITE_NAME: appName,
};

const TWITTER_TAGS = {
  CARD: "summary_large_image",
};

const OPEN_GRAPH_ELEMENTS = {
  type: /(<\s*\/?\s*)meta property="og:type"(\s*([^>]*)?\s*>)/gi,
  url: /(<\s*\/?\s*)meta property="og:url"(\s*([^>]*)?\s*>)/gi,
  title: /(<\s*\/?\s*)meta property="og:title"(\s*([^>]*)?\s*>)/gi,
  description: /(<\s*\/?\s*)meta property="og:description"(\s*([^>]*)?\s*>)/gi,
  image: /(<\s*\/?\s*)meta property="og:image"(\s*([^>]*)?\s*>)/gi,
  site_name: /(<\s*\/?\s*)meta property="og:site_name"(\s*([^>]*)?\s*>)/gi,
};

const TWITTER_ELEMENTS = {
  card: /(<\s*\/?\s*)meta name="twitter:card"(\s*([^>]*)?\s*>)/gi,
  url: /(<\s*\/?\s*)meta name="twitter:url"(\s*([^>]*)?\s*>)/gi,
  title: /(<\s*\/?\s*)meta name="twitter:title"(\s*([^>]*)?\s*>)/gi,
  description: /(<\s*\/?\s*)meta name="twitter:description"(\s*([^>]*)?\s*>)/gi,
  image: /(<\s*\/?\s*)meta name="twitter:image"(\s*([^>]*)?\s*>)/gi,
  "image:alt": /(<\s*\/?\s*)meta name="twitter:image:alt"(\s*([^>]*)?\s*>)/gi,
};

export const META_TAGS_ROUTES = {
  "/artwork/:artworkId": (data, request) => ({
    openGraph: {
      type: OPEN_GRAPH_TAGS.TYPE,
      url: constructFullUrl(request),
      title: data.artwork.current.title,
      description: data.artwork.owner.name,
      image: data.artwork.current.cover.source,
      site_name: OPEN_GRAPH_TAGS.SITE_NAME,
    },
    twitter: {
      card: TWITTER_TAGS.CARD,
      url: constructFullUrl(request),
      title: data.artwork.current.title,
      description: data.artwork.owner.name,
      image: data.artwork.current.cover.source,
      "image:alt": data.artwork.current.title,
    },
  }),
  "/user/:userUsername": (data, request) => ({
    openGraph: {
      type: OPEN_GRAPH_TAGS.TYPE,
      url: constructFullUrl(request),
      title: data.user.name,
      description: data.user.description || "Vesper user",
      image: data.user.avatar?.source || "/avatar.png",
      site_name: OPEN_GRAPH_TAGS.SITE_NAME,
    },
    twitter: {
      card: TWITTER_TAGS.CARD,
      url: constructFullUrl(request),
      title: data.user.name,
      description: data.user.description || "Vesper user",
      image: data.user.avatar?.source || "/avatar.png",
      "image:alt": data.user.name,
    },
  }),
};

const replaceMetatags = (file, data) => {
  for (const key in data.openGraph) {
    file = file.replace(
      OPEN_GRAPH_ELEMENTS[key],
      `<meta name="og:${key}" content="${data.openGraph[key]}" />`
    );
  }
  for (const key in data.twitter) {
    file = file.replace(
      TWITTER_ELEMENTS[key],
      `<meta name="twitter:${key}" content="${data.twitter[key]}" />`
    );
  }
  return file;
};

export const updateBotMetatags = async (data, req, res) => {
  try {
    const generatedData = META_TAGS_ROUTES[req.route.path](data, req);
    const filePath = path.join(dirname, "client/build", "index.html");
    let readFile = await fs.promises.readFile(filePath, "utf8");
    const modifiedFile = replaceMetatags(readFile, generatedData);
    const newPath = path.join(dirname, "client/build", "generated.html");
    await fs.promises.writeFile(newPath, modifiedFile);
  } catch (err) {
    // do nothing
  }
};
