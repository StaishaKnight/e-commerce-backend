const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

// find all tags by product data
router.get('/', (req, res) => {
  Tag.findAll({
    include:[
      {
        model: Product,
        through: ProductTag
      }
    ]
  }).then(dbTag => {
    res.json(dbTag);
  });
});



router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include:[
      {
        model: Product,
        through: ProductTag
      }
    ]
  }).then(dbTag => {
    if (!dbTag) {
      res.status(404).json({ message: 'Sorry, No Tag found with that ID'});
      return;
    }
    res.json(dbTag);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});


//create new tag
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  }).then(dbTag => {
    res.json(dbTag);
  });
});


// update tag by id
router.put('/:id', (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(dbTag => {
    if (!dbTag) {
      res.status(404).json({ message: 'Sorry, No Tag found with that ID'});
      return;
    }
    res.status(200).json({ message: 'Tag name has been updated'});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});


// Delete tag by id
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbTag => {
    if(!dbTag) {
      res.status(404).json({ message: 'Sorry, No tag found matching that ID'});
      return;
    }
    res.status(200).json({ message: 'Tag has been deleted'});
  });
});

module.exports = router;