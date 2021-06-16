// $CHECKED NOT USED (Can be safely removed)
// export const fetchCheckoutArtwork = async ({
//   userId,
//   artworkId,
//   connection,
// }) => {
//   const foundArtwork = await Artwork.findOne({
//     $and: [{ id: artworkId }, { active: true }],
//   }).populate(
//     "current",
//     "id cover created title personal type license availability description use commercial height width"
//   );
//   if (foundArtwork) {
//     res.json({
//       artwork: foundArtwork,
//     });
//   } else {
//     throw createError(400, "Artwork not found");
//   }
// };
