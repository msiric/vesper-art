const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const homeController = require('../../../controllers/homeController');

/* const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema'); */

router.get('/', homeController.getHomepage);

router.get('/categories/creative_writing', homeController.getCreativeWriting);

router.get('/categories/music', homeController.getMusic);

router.get('/categories/visual_arts', homeController.getVisualArts);

router
  .route('/search')
  .get(homeController.getSearchResults)
  .post(homeController.postSearchResults);

/* router.get('/api/add-promocode', (req, res, next) => {
  let promocode = new Promocode();
  promocode.name = 'testcoupon';
  promocode.discount = 0.4;
  promocode.save(function(err) {
    res.json('Successful');
  });
}); */

router.get('/notifications', isAuthenticated, homeController.getNotifications);

module.exports = router;
