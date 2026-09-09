const grid = document.getElementById("product-grid");
const filters = document.querySelectorAll(".filter");
let products = [];

function renderProducts(category = "all") {
  const visible = category === "all" ? products : products.filter(p => p.category === category);
  if (!visible.length) {
    grid.innerHTML = '<div class="loading">No products found.</div>';
    return;
  }
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <img class="product-image" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-meta">${escapeHtml(p.weight || p.category || "")}</div>
        <div class="price">${Number(p.price) > 0 ? euro(p.price) : "Price on request"}</div>
      </div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

filters.forEach(button => button.addEventListener("click", () => {
  filters.forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderProducts(button.dataset.category);
}));

(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  try {
    products = await getProducts();
    renderProducts();
  } catch (error) {
    grid.innerHTML = `<div class="loading">Unable to load the collection. Please check the database configuration.</div>`;
    console.error(error);
  }
})();
