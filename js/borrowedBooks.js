const apiUrl = "http://localhost:3000";
let borrowRecords = [];
let books = [];
let users = [];

// document.addEventListener("DOMContentLoaded", () => {
//   loadUsers();
//   loadBooks();
//   loadBorrowRecords();
// });

function loadUsers() {
  fetch(`${apiUrl}/Users`)
    .then(res => res.json())
    .then(data => {
      users = data;
    });
}

function loadBooks() {
  fetch(`${apiUrl}/Books`)
    .then(res => res.json())
    .then(data => {
      books = data;
    });
}

function loadBorrowRecords() {
  fetch(`${apiUrl}/BorrowRecords`)
    .then(res => res.json())
    .then(data => {
      borrowRecords = data;
      renderBorrowTable(borrowRecords);
    })
    .catch(err => console.error("Error loading borrow records:", err));
}


function renderBorrowTable(data) {
  const tbody = document.querySelector("#borrowRecordsTable tbody");
  tbody.innerHTML = "";

  data.forEach(record => {
    const user = users.find(u => u.UserID === record.UserID);
    const book = books.find(b => b.BookID === record.BookID);

    const userName = user?.Username || "N/A";
    const bookTitle = book?.Title || "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.RecordID}</td>
      <td>${userName}</td>
      <td>${bookTitle}</td>
      <td>${record.BorrowDate}</td>
      <td>${record.ReturnDate}</td>
      <td>${record.Status}</td>
    `;
    tbody.appendChild(row);
  });
}

loadUsers();
loadBooks();
loadBorrowRecords();
