import cartModel from "../models/carts.model.js";
import {productModel} from "../models/products.model.js";


// Configuración CartManager
class CartManager {
  async read() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      throw err;
    }
  }

  async create() {
    try {
      const newCart = new cartModel();
      await newCart.save();
      return newCart;
    } catch (err) {
      throw err;
    }
  }
  async delete(cartId) {
    try {
      const result = await cartModel.findByIdAndDelete(cartId);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async update(cartId, productId, quantity) {
    const myProduct = {
      id: productId,
      quantity: quantity,
    };
    try {
      const selectedCart = await cartModel.findById(cartId)
      const productExist = await selectedCart.products.find((product)=>product.id==productId)
      if(!productExist){
        selectedCart.products.push(myProduct)
        selectedCart.save()
      }
      else{
      const productIndex = await selectedCart.products.findIndex((product)=>product.id==productId)
      const newQuantity = await selectedCart.products[productIndex].quantity+quantity
      selectedCart.products[productIndex].quantity = newQuantity
      await cartModel.findByIdAndUpdate(cartId,{products: selectedCart.products})
      }
      }

    catch (err) {
      throw err;
    }
  }

async deleteCartProduct(cartId,productId){

  try {
    const selectedCart = await cartModel.findById(cartId)
    console.log(selectedCart)
    console.log(productId)
    const newCart = await cartModel.findByIdAndUpdate(cartId,{products: selectedCart.products.filter((product)=>product.product!=productId)})
  }
  catch (err) {
    throw err;
  }
}

async getCartById (cartId){
  try {
    const selectedCart = await cartModel.findById(cartId)
  }
  catch (err) {
    throw err;
  }

}
}

// Configuración ProductManager
class ProductManager {
  async read() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }

  async create(product) {
    try {
        const newProduct = new productModel(product);
        await newProduct.save();
        return newProduct;
    } catch (err) {
      throw err;
    }
  }

  async getProductByID(id){
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (err) {
      throw err;
    }
  }

  async delete(productId) {
    try {
      const result = await productModel.findByIdAndDelete(productId);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async update(productId, productProperty) {
    try {
      const newProductProperty = await productModel.findOneAndUpdate(productId,productProperty)
      newProductProperty.save()
      const newProduct = this.getProductByID(productId)
      return newProduct
    } catch (err) {
      throw err;
    }
  }

  async findCode(itemCode){
    try{
      const findCodeResult = await productModel.findOne({code:itemCode})
      return findCodeResult
    }
    catch (err) {
      throw err;
    }
  }

}
export { CartManager, ProductManager };