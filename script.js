
const WHATSAPP_NUMBER = "254706317008";

const products = [
  {
    id: 1,
    name: "Android Smartphone",
    category: "Phones",
    price: 8500,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Smartphone"
  },
  {
    id: 2,
    name: "Classic Wristwatch",
    category: "Wristwatches",
    price: 1800,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Wristwatch"
  },
  {
    id: 3,
    name: "Wireless Earpods",
    category: "Earpods",
    price: 1200,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Earpods"
  },
  {
    id: 4,
    name: "USB-C Charging Cable",
    category: "Cables",
    price: 350,
    image: "https://placehold.co/500x400/eeeeee/222222?text=USB-C+Cable"
  },
  {
    id: 5,
    name: "Fast Phone Charger",
    category: "Chargers",
    price: 850,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Charger"
  },
  {
    id: 6,
    name: "Wireless Headphones",
    category: "Headphones",
    price: 1800,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Headphones"
  },
  {
    id: 7,
    name: "Computer Keyboard",
    category: "Computer Accessories",
    price: 1500,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Keyboard"
  },
  {
    id: 8,
    name: "Wireless Computer Mouse",
    category: "Computer Accessories",
    price: 650,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Wireless+Mouse"
  },
  {
    id: 9,
    name: "Classic Sunglasses",
    category: "Eyewear",
    price: 700,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Sunglasses"
  },
  {
    id: 10,
    name: "Eyewear Chain",
    category: "Eyewear",
    price: 300,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Eyewear+Chain"
  },
  {
    id: 11,
    name: "Classic Everyday Belt",
    category: "Fashion Accessories",
    price: 650,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Belt"
  },
  {
    id: 12,
    name: "Classic Clogs",
    category: "Clogs",
    price: 1200,
    image: "https://placehold.co/500x400/eeeeee/222222?text=Classic+Clogs"
  }
];

// Demo catalogue: replace these sample prices with your verified selling prices.
// Add an oldPrice only when the previous price is genuine.
let cart = [];
let activeCategory = "All Products";
let searchTerm = "";

const productGrid = document.getElementById("productGrid");
const productStatus = document.getElementById("productStatus");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const sortSelect = document.getElementById("sortSelect");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const formatKsh = amount =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(amount).replace("KES", "KSh");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderFilters() {
  const categories = [
    "All Products",
    ...new Set(products.map(product => product.category))
  ];

  categoryFilters.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "filter-chip" + (category === activeCategory ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProducts();
    });
    categoryFilters.appendChild(button);
  });
}

function renderProducts() {
  let visibleProducts = products.filter(product => {
    const matchesCategory =
      activeCategory === "All Products" ||
      product.category === activeCategory;

    const matchesSearch =
      (product.name + " " + product.category)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortSelect.value === "low") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  productGrid.replaceChildren();
  productStatus.textContent =
    `${visibleProducts.length} products found`;

  if (visibleProducts.length === 0) {
    productStatus.textContent = "No matching products found. Try another search.";
    return;
  }

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.onerror = () => {
      image.onerror = null;
      image.src =
        "https://placehold.co/500x400/f3f3f3/333333?text=ZAWADI+Product";
    };

    imageWrap.appendChild(image);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("div");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const prices = document.createElement("div");
    prices.className = "product-prices";

    const currentPrice = document.createElement("span");
    currentPrice.className = "current-price";
    currentPrice.textContent = formatKsh(product.price);
    prices.appendChild(currentPrice);

    if (Number.isFinite(product.oldPrice) &&
        product.oldPrice > product.price) {
      const oldPrice = document.createElement("span");
      oldPrice.className = "old-price";
      oldPrice.textContent = formatKsh(product.oldPrice);
      prices.appendChild(oldPrice);

      const badge = document.createElement("span");
      badge.className = "sale-badge";
      badge.textContent =
        `${Math.round((1 - product.price / product.oldPrice) * 100)}% OFF`;
      imageWrap.appendChild(badge);
    }

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-cart-button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    info.append(category, name, prices, addButton);
    card.append(imageWrap, info);
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function renderCart() {
  cartItems.replaceChildren();

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatKsh(total);

  if (cart.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Your cart is empty. Add a product to get started.";
    cartItems.appendChild(message);
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("span");
    details.textContent =
      `${item.name} × ${item.quantity} — ${formatKsh(item.price * item.quantity)}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFromCart(item.id));

    row.append(details, removeButton);
    cartItems.appendChild(row);
  });
}

document.getElementById("cartButton").addEventListener("click", () => {
  cartPanel.hidden = !cartPanel.hidden;
  if (!cartPanel.hidden) {
    cartPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.getElementById("closeCartButton").addEventListener("click", () => {
  cartPanel.hidden = true;
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

document.querySelectorAll(".category-nav [data-category]").forEach(link => {
  link.addEventListener("click", () => {
    activeCategory = link.dataset.category;
    renderFilters();
    renderProducts();
  });
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  const lines = cart.map(item =>
    `• ${item.name} x${item.quantity}: ${formatKsh(item.price * item.quantity)}`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const message = [
    "Hello ZAWADI! I would like to order:",
    "",
    ...lines,
    "",
    `Total: ${formatKsh(total)}`,
    "",
    "Please confirm availability, delivery cost and payment details."
  ].join("\n");

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

document.getElementById("accountInfoButton").addEventListener("click", () => {
  showToast("Customer accounts will be enabled after Supabase setup.");
});

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

renderFilters();
renderProducts();
renderCart();
