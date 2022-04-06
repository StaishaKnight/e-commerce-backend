const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// FIND ALL CATEGORIES
router.get('/', (req, res) => { 
  Category.findAll({
    include:[
      {
      model: Product,
      attributes:['id', 'product_name', 'price', 'stock']
      }
    ]
  }).then(dbCategory => {
    res.json(dbCategory);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


// FIND ONE CATEGORY BY id
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes:['id', 'product_name', 'price', 'stock']
      }
    ]
  }).then(dbCategory => {
    if (!dbCategory) {
      res.status(404).json({ message: 'Sorry. No category with that ID '});
      return;
    }
    res.json(dbCategory);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});



// CREATE A NEW CATEGORY
router.post('/', (req, res) => {
console.log(req.body);
Category.create(
  {
    category_name: req.body.category_name
  })
.then(dbCategory => {
    res.json(dbCategory);
  });
});


// UPDATE A CATEGORY BY IT'S ID
router.put('/:id', (req, res) => {
  Category.update(
    {
    category_name:req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(dbCategory => {
    res.json(dbCategory);
  });
});

// DELETE ONE CATEGORY BY ID
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCategory => {
      if (!dbCategory) {
        res.status(404).json({ message: 'Sorry, No category found matching that ID' });
        return;
      }
      res.status(200).json({ message: `Category has been deleted`});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;