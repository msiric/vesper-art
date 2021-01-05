const TRANSFORMED_WIDTH = 500;

export const upload = {
  artwork: {
    fileSize: 10 * 1024 * 1024,
    fileDimensions: { height: 1200, width: 1200 },
    fileTransform: {
      width: TRANSFORMED_WIDTH,
      height: (fileHeight, fileWidth) =>
        fileHeight / (fileWidth / TRANSFORMED_WIDTH),
    },
    mimeTypes: ["image/jpg", "image/jpeg", "image/gif", "image/png"],
  },
  user: {
    fileSize: 5 * 1024 * 1024,
    fileDimensions: { height: 150, width: 150 },
    fileTransform: { width: 150 },
    mimeTypes: ["image/jpg", "image/jpeg", "image/png"],
  },
};

export const payment = {
  appFee: 0.15,
  buyerFee: {
    multiplier: 0.05,
    addend: 2.35,
  },
};
