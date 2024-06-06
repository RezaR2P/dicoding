// Selektor elemen DOM
const inputBook = document.getElementById("inputBook");
const searchBook = document.getElementById("searchBook");
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");

document.addEventListener("DOMContentLoaded", function () {
  // Memuat buku saat halaman dimuat
  loadBooks();
  inputBook.addEventListener("submit", addBook);
  searchBook.addEventListener("submit", searchBookByTitle);
});

function loadBooks() {
  const books = getBooksFromLocalStorage();
  books.forEach((book) => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  });
}

function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete =
    document.querySelector('input[name="pilihan"]:checked').id ===
    "inputBookIsComplete";

  const book = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  const bookElement = makeBookElement(book);

  if (isComplete) {
    completeBookshelfList.append(bookElement);
  } else {
    incompleteBookshelfList.append(bookElement);
  }

  addBookToLocalStorage(book);
  inputBook.reset();
}

function makeBookElement(book) {
  const bookElement = document.createElement("article");
  bookElement.classList.add("book_item");
  bookElement.setAttribute("id", `book-${book.id}`);

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const toggleReadButton = document.createElement("button");
  toggleReadButton.classList.add("green");
  toggleReadButton.innerText = book.isComplete
    ? "Belum selesai di Baca"
    : "Selesai dibaca";
  toggleReadButton.addEventListener("click", function () {
    toggleBookCompletion(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function () {
    removeBook(book.id);
  });

  actionContainer.append(toggleReadButton, deleteButton);
  bookElement.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookElement;
}

function getBooksFromLocalStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

function addBookToLocalStorage(book) {
  const books = getBooksFromLocalStorage();
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
}

function toggleBookCompletion(bookId) {
  const books = getBooksFromLocalStorage();
  const book = books.find((b) => b.id === bookId);
  book.isComplete = !book.isComplete;
  localStorage.setItem("books", JSON.stringify(books));

  const bookElement = document.getElementById(`book-${bookId}`);
  bookElement.remove();

  const newBookElement = makeBookElement(book);
  if (book.isComplete) {
    completeBookshelfList.append(newBookElement);
  } else {
    incompleteBookshelfList.append(newBookElement);
  }
}

function removeBook(bookId) {
  const books = getBooksFromLocalStorage();
  const updatedBooks = books.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(updatedBooks));

  const bookElement = document.getElementById(`book-${bookId}`);
  bookElement.remove();
}

function searchBookByTitle(event) {
  event.preventDefault();

  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromLocalStorage();

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  filteredBooks.forEach((book) => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  });
}
