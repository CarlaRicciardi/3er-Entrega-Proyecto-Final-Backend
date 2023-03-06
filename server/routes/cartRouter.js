const express = require('express');
const { Router } = express;
const cartRouter = Router();
const moment = require('moment');

const CarritosDaoMongoDB = require('../src/daos/carts/CarritosDaoMongoDB.js');
const contenedorCarrito = new CarritosDaoMongoDB();
const ProductosDaoMongoDB = require('../src/daos/products/ProductosDaoMongoDB.js');
const contenedorProd = new ProductosDaoMongoDB();

cartRouter.get('/', async (req, res) => {
  const lista = await contenedorCarrito.getAll('carts');
  res.json(lista);
});
//ME DEVUELVE UN ARRAY VACIO EN LOS PRODUCTOS...

cartRouter.post('/', async (req, res) => {
  try {
    const timestampCart = moment().format('DD / MM / YYYY, h:mm:ss');
    let idCart = await contenedorCarrito.newCart(timestampCart);
    res.json(`Se creo un carrito nuevo con id ${idCart}`);
  } catch {
    res.json('error!');
  }
});

cartRouter.get('/:id/productos', async (req, res) => {
  const { id } = req.params;
  const allProductsFromCart = await contenedorCarrito.getProductsFromCart(id);
  res.json(allProductsFromCart);
});

cartRouter.post('/:id/productos/:id_prod', async (req, res) => {
  try {
    let { id_prod } = req.params;
    let { id } = req.params;
    let productAddedCart = await contenedorProd.getById(id_prod, 'products');
    if (
      (await cart.getById(id, 'carts')) == 'No existe el número de id elegido'
    ) {
      res.json('error: "No existe ningún carrito con ese número de id"');
    } else if (productAddedCart == 'No existe el número de id elegido') {
      res.json('error: "No existe ningún producto con ese número de id"');
    } else {
      cart.addProductToCart(id, productAddedCart, id_prod);
      res.json(
        `Se añadio el producto ${productAddedCart.name} al carrito ${id}`
      );
    }
  } catch {
    res.json('error');
  }
});

cartRouter.delete('/:id', async (req, res) => {
  let { id } = req.params;
  const result = await contenedorProd.deleteById(id, 'carts');
  res.json({ carritoEliminado: id });
});

cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
  try {
    let { id_prod } = req.params;
    let { id } = req.params;
    let productoCarrito = await contenedorProd.getById(id_prod, 'products');
    if (
      (await cart.getById(id, 'carts')) == 'No existe el número de id elegido'
    ) {
      res.json('error: "No existe ningún carrito con ese número de id"');
    } else if (productoCarrito == 'No existe el número de id elegido') {
      res.json('error: "No existe ningún producto con ese número de id"');
    } else {
      await cart.deleteProductFromCart(id, id_prod);
      res.json(`Se eliminó el producto del carrito`);
    }
  } catch (e) {
    console.log(e);
    res.json('error');
  }
});

module.exports = cartRouter;
