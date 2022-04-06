const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// FIND ALL PRODUCTS
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category
      },
      {
        model: Tag,
        through: ProductTag
      }
    ]
  }).then(dbProduct => {
    if (!dbProduct) {
      res.status(404).json({ message: 'Sorry, No products found'});
      return;
    }
    res.json(dbProduct);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// FIND ONE PRODUCT BY ID
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category
      },
      {
        model: Tag,
        through: ProductTag
      }
    ]
  }).then(dbProduct => {
    if (!dbProduct) {
      res.status(404).json({ message: 'Sorry, No products found'});
      return;
    }
    res.json(dbProduct);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// CREATE NEW PRODUCT
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// UPDATE A PRODUCT BY ID
router.put('/:id', (req, res) => {
 
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
    
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
  
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);


      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
     
      res.status(400).json(err);
    });
});



// DELETE ONE PRODUCT BY ID
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbProduct => {
    if (!dbProduct) {
      res.status(404).json({ message: 'Sorry, No product found matching that ID'});
      return;
    }
    res.status(200).json({ message: 'Product has been deleted'});
  });
});

module.exports = router;
