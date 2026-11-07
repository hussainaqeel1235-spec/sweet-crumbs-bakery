
import { useState, useEffect } from "react";
import "./App.css";

const initialProducts = [
  {
    id: 1,
    name: "Chocolate Cake",
    category: "Cakes",
    price: 2000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    desc: "Rich chocolate cake with creamy frosting.",
    soldOut: false
  },
  {
    id: 2,
    name: "Strawberry Cake",
    category: "Cakes",
    price: 2500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600",
    desc: "Fresh strawberry cake with delicious cream.",
    soldOut: false
  },
  {
    id: 3,
    name: "Vanilla Cupcakes",
    category: "Cupcakes",
    price: 500,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600",
    desc: "Soft vanilla cupcakes with buttercream.",
    soldOut: false
  },
  {
  id: 4,
  name: "Chocolate Cupcakes",
  category: "Cupcakes",
  price: 600,
  image: "https://phippsbakerycafe.ca/cdn/shop/files/Chocolate_Cupcake_Pack_x_6.jpg?v=1760642367&width=1920",
  desc: "Chocolate cupcakes topped with rich frosting.",
  soldOut: false
},
  {
    id: 5,
    name: "Fudge Brownies",
    category: "Brownies",
    price: 400,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
    desc: "Soft and fudgy chocolate brownies.",
    soldOut: false
  },
  {
    id: 6,
    name: "Walnut Brownies",
    category: "Brownies",
    price: 500,
    image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600",
    desc: "Delicious brownies loaded with walnuts.",
    soldOut: false
  },
  {
    id: 7,
    name: "Chocolate Cookies",
    category: "Cookies",
    price: 300,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
    desc: "Crunchy cookies with chocolate chips.",
    soldOut: false
  },
  {
    id: 8,
    name: "Butter Cookies",
    category: "Cookies",
    price: 250,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600",
    desc: "Fresh homemade buttery cookies.",
    soldOut: false
  }
];

// Product sizes
const getSizeOptions = (product) => {
  if (product.category === "Cakes") {
    return [
      { label: "0.5 KG", extra: -700 },
      { label: "1 KG", extra: 0 },
      { label: "2 KG", extra: 1800 }
    ];
  }

  if (product.category === "Cupcakes") {
    return [
      { label: "Box of 6", extra: 0 },
      { label: "Box of 12", extra: 500 }
    ];
  }

  if (product.category === "Brownies") {
    return [
      { label: "Pack of 4", extra: 0 },
      { label: "Pack of 8", extra: 350 }
    ];
  }

  return [
    { label: "Pack of 6", extra: 0 },
    { label: "Pack of 12", extra: 250 }
  ];
};

// Product flavours
const getFlavorOptions = (product) => {
  if (product.category === "Cakes" || product.category === "Cupcakes") {
    return ["Chocolate", "Vanilla", "Strawberry"];
  }

  if (product.category === "Brownies") {
    return ["Classic Chocolate", "Walnut", "Double Chocolate"];
  }

  return ["Chocolate Chip", "Butter", "Vanilla"];
};

function App() {
  const [category, setCategory] = useState("All");

  // Products load from localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("sweetCrumbsProducts");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Admin states
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    category: "Cakes",
    price: "",
    image: "",
    desc: ""
  };

  const [productForm, setProductForm] = useState(emptyForm);

  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");

  // Cart load from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("sweetCrumbsCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Customer details
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  // Save products
  useEffect(() => {
    localStorage.setItem("sweetCrumbsProducts", JSON.stringify(products));
  }, [products]);

  // Save cart
  useEffect(() => {
    localStorage.setItem("sweetCrumbsCart", JSON.stringify(cart));
  }, [cart]);
  // Close product modal with Escape key
useEffect(() => {
  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setSelectedProduct(null);
    }
  };

  if (selectedProduct) {
    window.addEventListener("keydown", handleEscape);
  }

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
}, [selectedProduct]);

  // Admin form update
  const updateProductForm = (e) => {
    const { name, value } = e.target;

    setProductForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Add or update product
  const saveProduct = (e) => {
    e.preventDefault();

    const productData = {
      id: editingId || Date.now(),
      name: productForm.name.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      image: productForm.image.trim(),
      desc: productForm.desc.trim(),
      soldOut: editingId
        ? products.find((p) => p.id === editingId)?.soldOut || false
        : false
    };

    if (
      !productData.name ||
      !productData.price ||
      productData.price < 1 ||
      !productData.image ||
      !productData.desc
    ) {
      alert("Please enter valid product details.");
      return;
    }

    if (editingId) {
      setProducts((previous) =>
        previous.map((p) =>
          p.id === editingId ? productData : p
        )
      );

      alert("Product updated successfully!");
    } else {
      setProducts((previous) => [...previous, productData]);

      alert("New product added successfully!");
    }

    setProductForm(emptyForm);
    setEditingId(null);
  };

  // Edit product
  const editProduct = (product) => {
    setEditingId(product.id);

    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      image: product.image,
      desc: product.desc
    });

    setShowAdmin(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setProducts((previous) =>
      previous.filter((p) => p.id !== id)
    );

    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }

    alert("Product deleted successfully!");
  };

  // Sold Out / Available
  const toggleSoldOut = (id) => {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    setProducts((previous) =>
      previous.map((p) =>
        p.id === id ? { ...p, soldOut: !p.soldOut } : p
      )
    );

    // Remove sold-out product from cart
    if (!product.soldOut) {
      setCart((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    }
  };

  // Open product details
  const openProductDetails = (product) => {
    if (product.soldOut) return;

    setSelectedProduct(product);
    setSelectedSize(getSizeOptions(product)[0].label);
    setSelectedFlavor(getFlavorOptions(product)[0]);
  };

  // Close product details
  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  // Selected product size price
  const selectedSizeOption = selectedProduct
    ? getSizeOptions(selectedProduct).find(
        (size) => size.label === selectedSize
      )
    : null;

  const modalPrice = selectedProduct
    ? Math.max(
        1,
        selectedProduct.price + (selectedSizeOption?.extra || 0)
      )
    : 0;

  // Add product to cart
  const addToCart = (product, size, flavor, price) => {
    if (product.soldOut) {
      alert("Sorry! This product is currently sold out.");
      return;
    }

    const cartKey = `${product.id}-${size}-${flavor}`;

    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.cartKey === cartKey
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        {
          id: product.id,
          cartKey,
          quantity: 1,
          selectedSize: size,
          selectedFlavor: flavor,
          unitPrice: price
        }
      ];
    });

    closeProductDetails();
  };

  // Increase quantity
  const increaseQuantity = (cartKey) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        (item.cartKey || `${item.id}-default`) === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (cartKey) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          (item.cartKey || `${item.id}-default`) === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove from cart
  const removeFromCart = (cartKey) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          (item.cartKey || `${item.id}-default`) !== cartKey
      )
    );
  };

  // Cart products
  const cartProducts = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);

      return product && !product.soldOut
        ? {
            ...product,
            quantity: item.quantity,
            price: item.unitPrice ?? product.price,
            selectedSize: item.selectedSize || "",
            selectedFlavor: item.selectedFlavor || "",
            cartKey: item.cartKey || `${item.id}-default`
          }
        : null;
    })
    .filter(Boolean);

  // Cart count
  const cartCount = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Subtotal
  const subtotal = cartProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Delivery charges
  const delivery = subtotal === 0 || subtotal >= 5000 ? 0 : 250;

  // Final total
  const total = subtotal + delivery;

  // Filter products
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  // Customer details update
  const updateCustomer = (e) => {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // WhatsApp checkout
  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartProducts.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Confirm the correct bakery WhatsApp number before using this.
    const whatsappNumber = "923255445394";

    const orderItems = cartProducts
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}
Size: ${item.selectedSize || "Standard"}
Flavour: ${item.selectedFlavor || "Standard"}
Quantity: ${item.quantity}
Price: Rs ${item.price.toLocaleString("en-PK")} each
Item Total: Rs ${(item.price * item.quantity).toLocaleString("en-PK")}`
      )
      .join("\n\n");

    const message = `
 SWEET CRUMBS BAKERY - NEW ORDER

CUSTOMER DETAILS
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}

ORDER ITEMS
${orderItems}

ORDER SUMMARY
Subtotal: Rs ${subtotal.toLocaleString("en-PK")}
Delivery: ${delivery === 0 ? "FREE" : `Rs ${delivery.toLocaleString("en-PK")}`}
TOTAL: Rs ${total.toLocaleString("en-PK")}

Additional Note:
${customer.note || "No additional note"}

Thank you for ordering from Sweet Crumbs Bakery!
    `;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#home">
          Sweet Crumbs<span>.</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#cart">Cart ({cartCount})</a>
        </nav>

        <a href="#menu" className="nav-button">
          Order Now
        </a>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">FRESHLY BAKED WITH LOVE</p>

          <h1>
            Sweet Moments,<br />
            <span>Freshly Baked.</span>
          </h1>

          <p className="hero-text">
            Discover delicious homemade cakes, cupcakes,
            brownies and cookies made with love.
          </p>

          <a href="#menu" className="primary-button">
            Explore Our Menu →
          </a>

          <p className="location">
            Rawalpindi & Islamabad, Pakistan
          </p>
        </div>

        <div className="hero-art">
          <div className="cake-circle">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
              alt="Chocolate Cake"
            />
          </div>

          <span className="floating f1"></span>
          <span className="floating f2"></span>
          <span className="floating f3"></span>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-section" id="menu">
        <div className="section-heading">
          <p className="eyebrow">OUR SPECIAL COLLECTION</p>
          <h2>Made Fresh, Just for You</h2>
          <p>Explore our handmade bakery favourites.</p>
        </div>

        <div className="filters">
          {["All", "Cakes", "Cupcakes", "Brownies", "Cookies"].map((item) => (
            <button
              key={item}
              className={category === item ? "filter active" : "filter"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>
                <p>{product.desc}</p>

                <div className="product-bottom">
                  <strong>
                    Rs {product.price.toLocaleString("en-PK")}
                  </strong>

                  <button
                    className="add-button"
                    disabled={product.soldOut}
                    onClick={() => openProductDetails(product)}
                  >
                    {product.soldOut ? "Sold Out" : "View Details"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ADMIN PANEL */}
      {showAdmin && (
        <section className="admin-section" id="admin">
          <div className="section-heading">
            <p className="eyebrow">STORE MANAGEMENT</p>
            <h2>Admin Panel</h2>
            <p>Add, update, delete and manage bakery products.</p>
          </div>

          <form className="admin-form" onSubmit={saveProduct}>
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

            <label htmlFor="admin-name">Product Name</label>
            <input
              id="admin-name"
              type="text"
              name="name"
              placeholder="Enter product name"
              value={productForm.name}
              onChange={updateProductForm}
              required
            />

            <label htmlFor="admin-category">Category</label>
            <select
              id="admin-category"
              name="category"
              value={productForm.category}
              onChange={updateProductForm}
            >
              <option value="Cakes">Cakes</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Brownies">Brownies</option>
              <option value="Cookies">Cookies</option>
            </select>

            <label htmlFor="admin-price">Price (Rs)</label>
            <input
              id="admin-price"
              type="number"
              name="price"
              min="1"
              placeholder="Enter price"
              value={productForm.price}
              onChange={updateProductForm}
              required
            />

            <label htmlFor="admin-image">Product Image URL</label>
            <input
              id="admin-image"
              type="url"
              name="image"
              placeholder="Paste image URL"
              value={productForm.image}
              onChange={updateProductForm}
              required
            />

            <label htmlFor="admin-desc">Description</label>
            <textarea
              id="admin-desc"
              name="desc"
              rows="3"
              placeholder="Enter product description"
              value={productForm.desc}
              onChange={updateProductForm}
              required
            />

            <button type="submit" className="checkout-button">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="clear-cart-button"
                onClick={() => {
                  setEditingId(null);
                  setProductForm(emptyForm);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="admin-product-list">
            <h3>Manage Products ({products.length})</h3>

            {products.map((product) => (
              <div className="admin-product-item" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="admin-product-details">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <span>Rs {product.price.toLocaleString("en-PK")}</span>

                  <span className={product.soldOut ? "sold-out-text" : "available-text"}>
                    {product.soldOut ? "Sold Out" : "Available"}
                  </span>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSoldOut(product.id)}
                  >
                    {product.soldOut ? "Available" : "Sold Out"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={closeProductDetails}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeProductDetails}
            >
              ×
            </button>

            <img
              className="modal-product-image"
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <div className="modal-product-info">
              <span className="product-category">
                {selectedProduct.category}
              </span>

              <h2>{selectedProduct.name}</h2>

              <p>{selectedProduct.desc}</p>

              <label htmlFor="product-size">
                Select Size / Quantity
              </label>

              <select
                id="product-size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {getSizeOptions(selectedProduct).map((size) => (
                  <option key={size.label} value={size.label}>
                    {size.label}
                  </option>
                ))}
              </select>

              <label htmlFor="product-flavor">
                Select Flavour
              </label>

              <select
                id="product-flavor"
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
              >
                {getFlavorOptions(selectedProduct).map((flavor) => (
                  <option key={flavor} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>

              <div className="modal-price">
                Rs {modalPrice.toLocaleString("en-PK")}
              </div>

              <button
                type="button"
                className="checkout-button"
                disabled={selectedProduct.soldOut}
                onClick={() =>
                  addToCart(
                    selectedProduct,
                    selectedSize,
                    selectedFlavor,
                    modalPrice
                  )
                }
              >
                {selectedProduct.soldOut ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART */}
      <section className="cart-section" id="cart">
        <div className="section-heading">
          <p className="eyebrow">YOUR SHOPPING CART</p>
          <h2>My Cart ({cartCount} Items)</h2>
          <p>Your delicious treats are waiting for you!</p>
        </div>

        {cartProducts.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious bakery items to your cart.</p>

            <a href="#menu" className="primary-button">
              Explore Products
            </a>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartProducts.map((item) => (
                <div className="cart-item" key={item.cartKey}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    {item.selectedSize && (
                      <p>Size: {item.selectedSize}</p>
                    )}

                    {item.selectedFlavor && (
                      <p>Flavour: {item.selectedFlavor}</p>
                    )}

                    <p>
                      Rs {item.price.toLocaleString("en-PK")} each
                    </p>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item.cartKey)}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.cartKey)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <strong>
                      Rs {(item.price * item.quantity).toLocaleString("en-PK")}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.cartKey)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>Rs {subtotal.toLocaleString("en-PK")}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery Charges</span>
                <strong>
                  {delivery === 0
                    ? "FREE"
                    : `Rs ${delivery.toLocaleString("en-PK")}`}
                </strong>
              </div>

              {subtotal > 0 && subtotal < 5000 && (
                <p className="delivery-message">
                  Add Rs {(5000 - subtotal).toLocaleString("en-PK")} more
                  to get free delivery!
                </p>
              )}

              {subtotal >= 5000 && (
                <p className="delivery-message">
                  Congratulations! You got free delivery.
                </p>
              )}

              <div className="summary-total">
                <span>Total</span>
                <strong>Rs {total.toLocaleString("en-PK")}</strong>
              </div>

              <a
                href="#checkout"
                className="checkout-button checkout-link"
              >
                Proceed to Checkout
              </a>

              <button
                className="clear-cart-button"
                onClick={() => setCart([])}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CHECKOUT FORM */}
      {cartProducts.length > 0 && (
        <section className="checkout-section" id="checkout">
          <div className="section-heading">
            <p className="eyebrow">ALMOST THERE</p>
            <h2>Complete Your Order</h2>
            <p>Enter your details to place your bakery order.</p>
          </div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <label htmlFor="customer-name">Full Name *</label>
            <input
              id="customer-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={customer.name}
              onChange={updateCustomer}
              required
            />

            <label htmlFor="customer-phone">Phone Number *</label>
            <input
              id="customer-phone"
              type="tel"
              name="phone"
              placeholder="03XXXXXXXXX"
              pattern="03[0-9]{9}"
              title="Enter a valid Pakistani mobile number, e.g. 03001234567"
              value={customer.phone}
              onChange={updateCustomer}
              required
            />

            <label htmlFor="customer-address">Delivery Address *</label>
            <textarea
              id="customer-address"
              name="address"
              placeholder="Enter your complete delivery address"
              rows="4"
              value={customer.address}
              onChange={updateCustomer}
              required
            />

            <label htmlFor="customer-note">Order Note (Optional)</label>
            <textarea
              id="customer-note"
              name="note"
              placeholder="Any special instructions?"
              rows="3"
              value={customer.note}
              onChange={updateCustomer}
            />

            <button type="submit" className="checkout-button">
              Place Order on WhatsApp
            </button>
          </form>
        </section>
      )}

      {/* ABOUT */}
      <section className="about-section" id="about">
        <p className="eyebrow">MADE WITH LOVE</p>
        <h2>A Little Sweetness in Every Bite</h2>

        <p>
          We bring fresh homemade bakery treats to your special
          moments in Rawalpindi and Islamabad.
        </p>
      </section>

      {/* FOOTER */}
      <footer id="contact">
        <h2>Sweet Crumbs Bakery.</h2>
        <p>Freshly baked with love | Rawalpindi, Pakistan</p>
        <p>© 2026 Sweet Crumbs Bakery. All rights reserved.</p>
      </footer>

      {/* MOBILE CART BUTTON */}
      <a href="#cart" className="mobile-cart-button">
        
        View Cart ({cartCount}) · Rs {total.toLocaleString("en-PK")}
      </a>

    </div>
  );
}

export default App;
