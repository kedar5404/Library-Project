
const apiUrl = "http://localhost:3000";
let books = [];
let authors = [];
let sortOrder = {};

document.addEventListener("DOMContentLoaded", () => {
  loadAuthors();
  loadBooks();
  document.getElementById("bookForm").addEventListener("submit", saveBook);
  document.getElementById("globalSearch").addEventListener("input", searchBooks);
  addValidationListeners();
});

function addValidationListeners() {
  ["title", "AuthorID", "genre", "copies", "available"].forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener("blur", () => validateField(field));
  });
}
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  if (field.id === "title" || field.id === "genre") {
    isValid = value.length >= 3;
  } else if (field.id === "AuthorID") {
    isValid = value !== "";
  } else if (field.id === "copies" || field.id === "available") {
    isValid = !isNaN(value) && Number(value) >= 0;
  }

  if (isValid) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  return isValid;
}


function loadAuthors() {
  fetch(`${apiUrl}/Authors`)
    .then(res => res.json())
    .then(data => {
      authors = data;
      const authorSelect = document.getElementById("AuthorID");
      data.forEach(au => {
        authorSelect.innerHTML += `<option value="${au.AuthorID}">${au.Name}</option>`;
      });
    });
}

function loadBooks() {
  fetch(`${apiUrl}/Books`)
    .then(res => res.json())
    .then(data => {
      books = data;
      renderTable(books);
    });
}

function renderTable(data) {
  const tbody = document.getElementById("bookTableBody");
  tbody.innerHTML = "";
  data.forEach(b => {
    const Name = authors.find(d => d.AuthorID == b.AuthorID)?.Name || "N/A";
    tbody.innerHTML += `
      <tr>
        <td>${b.Title}</td>
        <td>${Name}</td>
        <td>${b.Genre}</td>
        <td>${b.TotalCopies}</td>
        <td>${b.AvailableCopies}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editBook(${b.id})"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteBook(${b.id})"> <i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function saveBook(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const AuthorID = document.getElementById("AuthorID");
  const genre = document.getElementById("genre");
  const copies = document.getElementById("copies");
  const available = document.getElementById("available");

  const valid = [title, AuthorID, genre, copies, available].every(validateField);
  if (!valid) return;

  // const Name = authors.find(d => d.AuthorID == AuthorID.value)?.Name || "";
  const book = {
    Title: title.value.trim(),
    AuthorID: Number(AuthorID.value),
    Genre: genre.value.trim(),
    TotalCopies: Number(copies.value),
    AvailableCopies: Number(available.value)
  };

  if (id) {
    fetch(`${apiUrl}/Books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    }).then(loadBooks);
  } else {
    fetch(`${apiUrl}/Books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    }).then(loadBooks);
  }

  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  document.querySelectorAll(".form-control, .form-select").forEach(el => {
    el.classList.remove("is-valid", "is-invalid");
  });
}

function editBook(id) {
  const book = books.find(b => b.id == id);
  if (!book) return;
  document.getElementById("bookId").value = book.BookID;
  document.getElementById("title").value = book.Title;
  document.getElementById("AuthorID").value = book.AuthorID;
  document.getElementById("genre").value = book.Genre;
  document.getElementById("copies").value = book.TotalCopies;
  document.getElementById("available").value = book.AvailableCopies;
}

function deleteBook(id) {
  if (confirm("Are you sure you want to delete this Book?")) {
    fetch(`${apiUrl}/Books/${id}`, { method: "DELETE" }).then(loadBooks);
  }
}

function sortTable(column) {
  const order = sortOrder[column] === "asc" ? "desc" : "asc";
  sortOrder[column] = order;

  const sorted = [...books].sort((a, b) => {
    let aVal = column === "deptName"
      ? departments.find(d => d.deptId == a.deptId)?.deptName || ""
      : a[column];
    let bVal = column === "deptName"
      ? departments.find(d => d.deptId == b.deptId)?.deptName || ""
      : b[column];

    if (typeof aVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  renderTable(sorted);
}

function searchBooks(e) {
  const value = e.target.value.toLowerCase();
  const filtered = books.filter(book =>
    Object.values(book).some(val => String(val).toLowerCase().includes(value)) ||
    departments.find(d => d.deptId == book.deptId)?.deptName.toLowerCase().includes(value)
  );
  renderTable(filtered);
}


loadBooks();
