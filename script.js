document.addEventListener("DOMContentLoaded", () => {
  let grid_box = document.querySelector(".grid");
  let carteItems = document.getElementById("cart-items");

  // Data
  const products = [
    { id: 1, name: "Produit A", price: 10000 },
    { id: 2, name: "Produit B", price: 15000 },
    { id: 3, name: "Produit C", price: 20000 },
  ];

  /* Print content */
  printProducts(products, grid_box);

  // Ajouter un produit au panier
  carteItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-add")) {
      console.log(event.target);
      addToCart(event.target, carteItems);
    } else if (event.target.classList.contains("btn-edit")) {
      editCartItem(event.target);
    } else if (event.target.classList.contains("btn-remove")) {
      removeCartItem(event.target);
    }
  });
});
// Logique pour afficher les Produits.
function printProducts(products, container) {
  products.forEach((product) => {
    let box_article = createProductBox(product);
    container.appendChild(box_article);
  });
}

function createProductBox(product) {
  let box_article = document.createElement("div");
  box_article.classList.add("bg-white", "p-4", "rounded-lg", "shadow-lg");

  let titreArticle = createProductTitle(product.name);
  let spanArticle = createProductPrice(product.price);
  let inputarticle = createQuantityInput();
  let btnarticle = createAddButton(product);

  box_article.appendChild(titreArticle);
  box_article.appendChild(spanArticle);
  box_article.appendChild(inputarticle);
  box_article.appendChild(btnarticle);

  return box_article;
}

function createProductTitle(name) {
  let titreArticle = document.createElement("h2");
  titreArticle.textContent = name;
  return titreArticle;
}

function createProductPrice(price) {
  let spanArticle = document.createElement("span");
  spanArticle.classList.add("mr-4");
  spanArticle.textContent = price + " XOF";
  return spanArticle;
}

function createQuantityInput() {
  let inputarticle = document.createElement("input");
  inputarticle.classList.add(
    "border",
    "p-1",
    "border-gray-500",
    "rounded-lg",
    "w-1/6"
  );
  inputarticle.type = "number";
  inputarticle.id = "compteurCommande";
  inputarticle.value = 1;
  return inputarticle;
}

function createAddButton(product) {
  let btnarticle = document.createElement("button");
  btnarticle.textContent = "Ajouter";
  btnarticle.classList.add(
    "bg-red-500",
    "hover:bg-red-800",
    "text-white",
    "rounded-lg",
    "py-1",
    "px-4",
    "mx-2",
    "btn-add"
  );
  btnarticle.addEventListener("click", () => {
    addToCart(btnarticle, document.getElementById("cart-items"), product);
  });
  return btnarticle;
}

function addToCart(button, container, product) {
  let inputarticle = button.previousElementSibling;
  let quantity = parseInt(inputarticle.value);

  let tr = createCartRow(product, quantity);
  let existingRow = document.getElementById(`${product.name}-${product.id}`);

  if (existingRow) {
    updateCartRow(existingRow, quantity);
  } else {
    container.appendChild(tr);
  }
}

function createCartRow(product, quantity) {
  let tr = document.createElement("tr");
  tr.id = `${product.name}-${product.id}`;

  let tdProduit = createCartCell(product.name, "border border-slate-300");
  let qtTotal = createCartCell(quantity, "border border-slate-300 qtTotal");
  let tdTotal = createCartCell(
    (product.price * quantity).toFixed(2),
    "border border-slate-300 tdTotal"
  );
  let tdOptions = createCartCell("", "border border-slate-300 tdOptions");

  let btnEdit = createEditButton(product, quantity);
  let btnRemove = createRemoveButton(tr);

  tdOptions.appendChild(btnEdit);
  tdOptions.appendChild(btnRemove);

  tr.appendChild(tdProduit);
  tr.appendChild(qtTotal);
  tr.appendChild(tdTotal);
  tr.appendChild(tdOptions);

  return tr;
}

function createCartCell(content, classes) {
  let cell = document.createElement("td");
  cell.classList.add(...classes.split(" "));
  cell.textContent = content;
  return cell;
}

function updateCartRow(row, quantity) {
  let existingQtTotal = row.querySelector(".qtTotal");
  existingQtTotal.textContent =
    parseInt(existingQtTotal.textContent) + quantity;

  let existingTdTotal = row.querySelector(".tdTotal");
  let product = getProductFromRow(row);
  existingTdTotal.textContent = (
    product.price * existingQtTotal.textContent
  ).toFixed(2);
}

function getProductFromRow(row) {
  let productName = row.querySelector("td:first-child").textContent;
  return products.find((product) => product.name === productName);
}

function createEditButton(product, quantity) {
  let btnEdit = document.createElement("button");
  btnEdit.textContent = "Éditer";
  btnEdit.classList.add(
    "bg-blue-500",
    "hover:bg-blue-800",
    "text-white",
    "rounded-lg",
    "py-1",
    "px-4",
    "mx-2",
    "btn-edit"
  );
  btnEdit.addEventListener("click", () => {
    editCartItem(btnEdit, product, quantity);
  });
  return btnEdit;
}

function createRemoveButton(row) {
  let btnRemove = document.createElement("button");
  btnRemove.textContent = "Supprimer";
  btnRemove.classList.add(
    "bg-red-500",
    "hover:bg-red-800",
    "text-white",
    "rounded-lg",
    "py-1",
    "px-4",
    "mx-2",
    "btn-remove"
  );
  btnRemove.addEventListener("click", () => {
    removeCartItem(row);
  });
  return btnRemove;
}

function editCartItem(button, product, quantity) {
  let tr = button.closest("tr");
  let qtInput = document.createElement("input");
  qtInput.type = "number";
  qtInput.value = quantity;
  qtInput.classList.add(
    "border",
    "p-1",
    "border-gray-500",
    "rounded-lg",
    "w-1/6"
  );

  let tdQtTotal = tr.querySelector(".qtTotal");
  tdQtTotal.textContent = "";
  tdQtTotal.appendChild(qtInput);

  let btnSave = document.createElement("button");
  btnSave.textContent = "Enregistrer";
  btnSave.classList.add(
    "bg-green-500",
    "hover:bg-green-800",
    "text-white",
    "rounded-lg",
    "py-1",
    "px-4",
    "mx-2"
  );
  btnSave.addEventListener("click", () => {
    saveCartItemEdit(tr, product, qtInput.value);
  });

  let btnCancel = document.createElement("button");
  btnCancel.textContent = "Annuler";
  btnCancel.classList.add(
    "bg-gray-500",
    "hover:bg-gray-800",
    "text-white",
    "rounded-lg",
    "py-1",
    "px-4",
    "mx-2"
  );
  btnCancel.addEventListener("click", () => {
    cancelCartItemEdit(tr, quantity);
  });

  let tdOptions = tr.querySelector(".tdOptions");
  tdOptions.innerHTML = "";
  tdOptions.appendChild(btnSave);
  tdOptions.appendChild(btnCancel);
}

function saveCartItemEdit(row, product, newQuantity) {
  let qtTotal = row.querySelector(".qtTotal");
  qtTotal.textContent = newQuantity;

  let tdTotal = row.querySelector(".tdTotal");
  tdTotal.textContent = (product.price * newQuantity).toFixed(2);

  let tdOptions = row.querySelector(".tdOptions");
  tdOptions.innerHTML = "";

  let btnEdit = createEditButton(product, newQuantity);
  let btnRemove = createRemoveButton(row);

  tdOptions.appendChild(btnEdit);
  tdOptions.appendChild(btnRemove);
}

function cancelCartItemEdit(row, quantity) {
  let qtTotal = row.querySelector(".qtTotal");
  qtTotal.textContent = quantity;

  let tdOptions = row.querySelector(".tdOptions");
  tdOptions.innerHTML = "";

  let product = getProductFromRow(row);
  let btnEdit = createEditButton(product, quantity);
  let btnRemove = createRemoveButton(row);

  tdOptions.appendChild(btnEdit);
  tdOptions.appendChild(btnRemove);
}

function removeCartItem(button) {
  let row = button.closest("tr");
  row.remove();
}
