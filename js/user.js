let allBooks = [];

document.addEventListener("DOMContentLoaded", () => {
  const row = document.getElementById("bookCardsRow");
  const searchInput = document.getElementById("searchInput");

  fetch("http://localhost:3000/Books")
    .then((res) => res.json())
    .then((books) => {
      allBooks = books;
      displayBooks(allBooks);
    })
    .catch((error) => console.error("Error fetching books:", error));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = allBooks.filter(
      (book) =>
        book.Title.toLowerCase().includes(query) ||
        book.Genre.toLowerCase().includes(query)
    );
    displayBooks(filteredBooks);
  });

  function displayBooks(books) {
    row.innerHTML = "";

    if (books.length === 0) {
      row.innerHTML = "<p>No books found.</p>";
      return;
    }

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "col-sm-12 col-md-6 col-lg-4 my-3";

      card.innerHTML = `
        <div class="card border-primary" style="max-width: 100%;">
          <div class="card-header">${book.Genre}</div>
          <div class="card-body">
            <h4 class="card-title">${book.Title}</h4>
            <p class="card-text"><strong>Total Copies:</strong> ${book.TotalCopies}</p>
            <p class="card-text"><strong>Available:</strong> ${book.AvailableCopies}</p>
            <a href="#" class="btn btn-outline-primary">Borrow Book</a>
          </div>
        </div>
      `;

      row.appendChild(card);
    });
  }
});
