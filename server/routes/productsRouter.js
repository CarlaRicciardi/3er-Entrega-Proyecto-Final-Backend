const express = require('express');
const { Router } = express;
const productsRouter = Router();
const ProductosDaoMongoDB = require('../src/daos/products/ProductosDaoMongoDB.js');
const contenedorProd = new ProductosDaoMongoDB();
const moment = require('moment/moment.js');

//middleware
let isAdmin = true;

const middlewareAdmin = (req, res, next) => {
  if (isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: true, descripcion: 'Solo para usuarios administradores' });
  }
};

productsRouter.get('/', async (req, res) => {
  const productsList = await contenedorProd.getAll('products');
  // res.json(productsList);
  res.render('productsList', {productsList})
});

// GET '/api/productos' -> muestra todos los productos o o devuelve un producto segun id.
productsRouter.get('/:id?', async (req, res) => {
  const { id } = req.params;
  if (id) {
    const productsList = await contenedorProd.getById(id, 'products');
    res.json({ products: productsList });
  } else {
    const productsList = await contenedorProd.getAll('products');
    res.json({ productsList });
  }
});

// POST '/api/productos' -> incorpora productos al listado (solo admins)
productsRouter.post('/', middlewareAdmin, async (req, res) => {
  const { body } = req;
  const timestamp = moment().format('DD / MM / YYYY, h:mm:ss');
  try {
    let addProduct = await contenedorProd.save(
      timestamp,
      body.title,
      body.price,
      body.thumbnail
    );
    console.log('addProduct:', addProduct);
    res.json({ addProduct });
    // console.log("addProduct:", addProduct)
  } catch {
    res.json({ error: true, msg: 'No se pudo guardar el producto' });
  }
});

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id. (solo admins)
productsRouter.put('/:id', middlewareAdmin, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { body } = req;
  console.log(body);
  const timestamp = moment().format('DD / MM / YYYY, h:mm:ss');
  try {
    let updateProduct = await contenedorProd.update(
      id,
      timestamp,
      body.title,
      body.price,
      body.thumbnail
    );
    res.json({ updated: updateProduct });
  } catch (e) {
    console.log(e);
    res.json({ error: true });
  }
});
//NO SE ACTUALIZA, ME DEVUELVE EL PRODUCTO POR CONSOLA PERO ME DICE QUE ES UNDEFINED EN POSTMAN

// DELETE '/api/productos/:id' -> elimina un producto según su id. (solo admins)
productsRouter.delete('/:id', middlewareAdmin, async (req, res) => {
  let { id } = req.params;
  try {
    const result = await contenedorProd.deleteById(id, 'products');
    res.json(result);
  } catch (e) {
    res.json({ error: true, msg: 'producto no encontrado' });
  }
});

module.exports = productsRouter;
