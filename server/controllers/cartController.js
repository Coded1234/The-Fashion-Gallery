const { Cart, CartItem, Product } = require("../models");

// Helper function to calculate cart total
const calculateCartTotal = async (cartId) => {
  const items = await CartItem.findAll({ where: { cartId } });
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );
  await Cart.update({ totalAmount: total }, { where: { id: cartId } });
  return total;
};

// Helper function to identify cart owner
const getCartIdentifier = (req) => {
  if (req.user) {
    return { userId: req.user.id };
  }
  const sessionId = req.headers["x-session-id"];
  if (sessionId) {
    return { sessionId };
  }
  return null;
};

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const identifier = getCartIdentifier(req);
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Session ID or Authentication required" });
    }

    let cart = await Cart.findOne({
      where: identifier,
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price", "sizes"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create(identifier);
      cart.items = [];
    } else if (cart.items && cart.items.length > 0) {
      // Recalculate total amount to ensure it's accurate
      await calculateCartTotal(cart.id);
      // Refetch cart with updated total
      cart = await Cart.findOne({
        where: identifier,
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "images", "price", "sizes"],
              },
            ],
          },
        ],
      });
    }

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Get product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock using totalStock instead of per-size stock
    if (product.totalStock < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock for selected size" });
    }

    const identifier = getCartIdentifier(req);
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Session ID or Authentication required" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: identifier });
    if (!cart) {
      cart = await Cart.create(identifier);
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId, size },
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.totalStock) {
        return res
          .status(400)
          .json({ message: "Cannot add more than available stock" });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // Add new item
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        size,
        color: color || {},
        price: product.price,
      });
    }

    // Calculate total
    await calculateCartTotal(cart.id);

    // Get updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price", "sizes"],
            },
          ],
        },
      ],
    });

    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const identifier = getCartIdentifier(req);
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Session ID or Authentication required" });
    }

    const cart = await Cart.findOne({ where: identifier });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check stock using totalStock
    const product = await Product.findByPk(cartItem.productId);

    if (quantity > product.totalStock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Calculate total
    await calculateCartTotal(cart.id);

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price", "sizes"],
            },
          ],
        },
      ],
    });

    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const identifier = getCartIdentifier(req);
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Session ID or Authentication required" });
    }

    const cart = await Cart.findOne({ where: identifier });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.destroy({
      where: { id: itemId, cartId: cart.id },
    });

    // Calculate total
    await calculateCartTotal(cart.id);

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price", "sizes"],
            },
          ],
        },
      ],
    });

    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const identifier = getCartIdentifier(req);
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Session ID or Authentication required" });
    }

    const cart = await Cart.findOne({ where: identifier });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
      cart.totalAmount = 0;
      await cart.save();
    }

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

// @desc    Merge guest cart into user cart
// @route   POST /api/cart/merge
const mergeCart = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    // this route is strictly protected, so req.user exists
    if (!sessionId) {
      return res
        .status(400)
        .json({ message: "Session ID required for merging" });
    }

    const guestCart = await Cart.findOne({
      where: { sessionId },
      include: [{ model: CartItem, as: "items" }],
    });
    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return res.json({ message: "No guest cart items to merge" });
    }

    let userCart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!userCart) {
      userCart = await Cart.create({ userId: req.user.id });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = await CartItem.findOne({
        where: {
          cartId: userCart.id,
          productId: guestItem.productId,
          size: guestItem.size,
        },
      });

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
        await existingItem.save();
      } else {
        await CartItem.create({
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: guestItem.quantity,
          size: guestItem.size,
          color: guestItem.color,
          price: guestItem.price,
        });
      }
    }

    // Clear guest cart
    await CartItem.destroy({ where: { cartId: guestCart.id } });
    await guestCart.destroy();

    await calculateCartTotal(userCart.id);

    // fetch updated cart to return
    const updatedCart = await Cart.findByPk(userCart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "images", "price", "sizes"],
            },
          ],
        },
      ],
    });

    res.json({ message: "Cart merged successfully", cart: updatedCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error merging cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
};
