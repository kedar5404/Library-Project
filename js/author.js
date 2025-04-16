const apiUrl = "http://localhost:3000/Authors";
const form = document.getElementById("authorForm");
const authorNameInput = document.getElementById("authorName");
const authorDetailsInput = document.getElementById("authorDetails");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.createElement("input");
let editId = null;
let allAuthors = [];
let sortDirection = 1;

// Search bar setup
searchInput.setAttribute("type", "text");
searchInput.setAttribute("placeholder", "Search by Author Name...");
searchInput.classList.add("form-control", "mb-3");
document.querySelector(".table").parentNode.insertBefore(searchInput, document.querySelector(".table"));

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allAuthors.filter(a =>
        a.Name.toLowerCase().includes(searchTerm)
    );
    renderAuthors(filtered);
});

// Validation
[authorNameInput, authorDetailsInput].forEach(input => {
    input.addEventListener("blur", () => {
        if (input.value.trim().length < 5) {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }
    });
});

function validateForm() {
    let isValid = true;
    [authorNameInput, authorDetailsInput].forEach(input => {
        if (input.value.trim().length < 5) {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            isValid = false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }
    });
    return isValid;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const author = {
        Name: authorNameInput.value.trim(),
        Bio: authorDetailsInput.value.trim()
    };

    if (editId) {
        fetch(`${apiUrl}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(author)
        }).then(() => {
            fetchAndRenderAuthors();
            form.reset();
            editId = null;
            submitBtn.textContent = "Add Author";
            clearValidation();
        });
    } else {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(author)
        }).then(() => {
            fetchAndRenderAuthors();
            form.reset();
            clearValidation();
        });
    }
});

function clearValidation() {
    authorNameInput.classList.remove("is-valid", "is-invalid");
    authorDetailsInput.classList.remove("is-valid", "is-invalid");
}

function fetchAndRenderAuthors() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            allAuthors = data;
            renderAuthors(data);
        });
}

function renderAuthors(authors) {
    const tbody = document.getElementById("authorTableBody");
    tbody.innerHTML = "";

    authors.forEach(author => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${author.AuthorID}</td>
      <td>${author.Name}</td>
      <td>${author.Bio}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${author.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${author.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(row);
    });
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            loadAuthorForEdit(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteAuthor(id);
        });
    });
}
// Sorting logic on Category Name
document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allAuthors].sort((a, b) =>
        a.Name.localeCompare(b.Name) * sortDirection
    );
    sortDirection *= -1;
    renderAuthors(sorted);
});

function loadAuthorForEdit(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(data => {
            authorNameInput.value = data.Name;
            authorDetailsInput.value = data.Bio;
            editId = id;
            submitBtn.textContent = "Update Author";
        });
}

function deleteAuthor(id) {
    if (confirm("Are you sure you want to delete this author?")) {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        }).then(() => fetchAndRenderAuthors());
    }
}

fetchAndRenderAuthors();
