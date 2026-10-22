"use strict";

const products = {
  dome: { name: "Купол", price: 8900, image: "dome.webp" },
  line: { name: "Линия", price: 6400, image: "line.webp" },
  point: { name: "Точка", price: 4700, image: "point.webp" },
};
const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const isProduct = (id) => Object.hasOwn(products, id);
const query = new URLSearchParams(window.location.search);

const orderModal = document.getElementById("order-modal");
orderModal?.addEventListener("show.bs.modal", (event) => {
  const requestedId = event.relatedTarget?.dataset.product;
  const id = isProduct(requestedId) ? requestedId : "dome";
  const product = products[id];
  document.getElementById("modal-product").textContent =
    `${product.name} — ${currency.format(product.price)}`;
  document.getElementById("modal-order-link").href = `order.html?product=${id}`;
});

if (
  document.querySelector(".product") &&
  !window.location.hash &&
  isProduct(query.get("product"))
) {
  window.location.replace(
    `${window.location.pathname}${window.location.search}#${query.get("product")}`,
  );
}

const filterForm = document.getElementById("catalog-filters");
if (filterForm) {
  const groups = Array.from(document.querySelectorAll(".catalog__group"));
  const cards = Array.from(document.querySelectorAll(".product-column"));
  const search = document.getElementById("search");
  const category = document.getElementById("category");
  const maxPrice = document.getElementById("max-price");
  const sort = document.getElementById("sort");
  const normalize = (value) =>
    value.trim().toLocaleLowerCase("ru-RU").replaceAll("ё", "е");
  function applyFilters() {
    const term = normalize(search.value);
    const ceiling = maxPrice.value === "" ? Infinity : Number(maxPrice.value);
    const powers = Array.from(
      filterForm.querySelectorAll('[name="power"]:checked'),
    ).map((input) => input.value);
    let count = 0;
    cards.forEach((card) => {
      const matches =
        normalize(card.dataset.name).includes(term) &&
        (category.value === "all" ||
          card.dataset.category === category.value) &&
        Number(card.dataset.price) <= ceiling &&
        (powers.length === 0 || powers.includes(card.dataset.power));
      card.hidden = !matches;
      if (matches) count++;
    });
    groups.forEach((group) => {
      const grid = group.querySelector(".product-grid");
      const ordered = cards.filter((card) => group.contains(card));
      if (sort.value === "price-asc")
        ordered.sort(
          (a, b) => Number(a.dataset.price) - Number(b.dataset.price),
        );
      if (sort.value === "price-desc")
        ordered.sort(
          (a, b) => Number(b.dataset.price) - Number(a.dataset.price),
        );
      if (sort.value === "name")
        ordered.sort((a, b) =>
          a.dataset.name.localeCompare(b.dataset.name, "ru"),
        );
      ordered.forEach((card) => grid.append(card));
      group.hidden = ordered.every((card) => card.hidden);
    });
    document.getElementById("catalog-count").textContent =
      `Найдено моделей: ${count}`;
    document.getElementById("catalog-empty").hidden = count !== 0;
  }
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });
  filterForm.addEventListener("input", () => {
    if (filterForm.checkValidity()) applyFilters();
  });
  filterForm.addEventListener("change", () => {
    if (filterForm.checkValidity()) applyFilters();
  });
  filterForm.addEventListener("reset", () => setTimeout(applyFilters, 0));
  document.getElementById("reset-empty").addEventListener("click", () => {
    filterForm.reset();
    search.focus();
  });
}

const orderForm = document.getElementById("order-form");
if (orderForm) {
  const productSelect = document.getElementById("product");
  const quantity = document.getElementById("quantity");
  const customerName = document.getElementById("customer-name");
  const phone = document.getElementById("customer-phone");
  const success = document.getElementById("order-success");
  const requestedId = query.get("product");
  if (isProduct(requestedId)) {
    productSelect.value = requestedId;
    productSelect.querySelector(
      `option[value="${requestedId}"]`,
    ).defaultSelected = true;
  }
  function validateContact() {
    const letters = customerName.value.trim().match(/\p{L}/gu) || [];
    customerName.setCustomValidity(
      letters.length >= 2 ? "" : "Введите имя: не менее двух букв.",
    );
    const digits = phone.value.replace(/\D/g, "");
    const validPhone =
      digits.length === 10 && /^[\d\s()\-]+$/.test(phone.value);
    phone.setCustomValidity(
      validPhone
        ? ""
        : "Введите 10 цифр после +7. Допустимы пробелы, скобки и дефисы.",
    );
  }
  function updateSummary() {
    const id = productSelect.value;
    const image = document.getElementById("summary-image");
    image.hidden = !isProduct(id);
    if (!isProduct(id)) {
      document.getElementById("summary-name").textContent =
        "Светильник ещё не выбран";
      document.getElementById("summary-quantity").textContent =
        "Выберите модель в форме.";
      document.getElementById("summary-total").textContent = "—";
      return;
    }
    const product = products[id];
    const count = Number(quantity.value);
    const validCount =
      quantity.value !== "" &&
      Number.isInteger(count) &&
      count >= 1 &&
      count <= 10;
    image.src = `images/${product.image}`;
    image.alt = `Светильник ${product.name}`;
    document.getElementById("summary-name").textContent = product.name;
    document.getElementById("summary-quantity").textContent = validCount
      ? `${count} шт. × ${currency.format(product.price)}`
      : "Укажите количество от 1 до 10.";
    document.getElementById("summary-total").textContent = validCount
      ? currency.format(count * product.price)
      : "—";
  }
  customerName.addEventListener("input", validateContact);
  phone.addEventListener("input", validateContact);
  orderForm.addEventListener("input", () => {
    success.hidden = true;
    updateSummary();
  });
  orderForm.addEventListener("change", () => {
    success.hidden = true;
    updateSummary();
  });
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateContact();
    if (!orderForm.reportValidity()) return;
    const product = products[productSelect.value];
    if (!product) return;
    const count = Number(quantity.value);
    document.getElementById("order-success-text").textContent =
      `Модель «${product.name}», ${count} шт. Демонстрационная сумма: ${currency.format(product.price * count)}.`;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: "nearest" });
  });
  orderForm.addEventListener("reset", () => {
    success.hidden = true;
    setTimeout(() => {
      validateContact();
      updateSummary();
    }, 0);
  });
  validateContact();
  updateSummary();
}
