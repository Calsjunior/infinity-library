const myLibrary = [];
let currentEditingId = null;

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the new operator to call the constructor");
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.update = function (book) {
    this.title = book.title;
    this.author = book.author;
    this.pages = book.pages;
    this.read = book.read;
};

addBookToLibrary(new Book("Harry", "J.K.", 129, true));
displayBooks();

function getBookFieldsFromInput() {
    const form = document.querySelector("#add-book-form");
    const bookTitle = form.elements["book-title"].value;
    const bookAuthor = form.elements["book-author"].value;
    const bookPages = form.elements["book-pages"].value;
    const bookStatus = form.elements["book-status"].checked;
    return {
        title: bookTitle,
        author: bookAuthor,
        pages: parseInt(bookPages, 10),
        read: bookStatus,
    };
}

function setBookFieldsToInput(title, author, pages, status) {
    const form = document.querySelector("#add-book-form");
    form.elements["book-title"].value = title;
    form.elements["book-author"].value = author;
    form.elements["book-pages"].value = pages;
    form.elements["book-status"].checked = status;
}
function addBookToLibrary(book) {
    myLibrary.push(book);
}

function removeBookFromLibrary(book) {
    const index = myLibrary.indexOf(book);
    if (index > -1) {
        myLibrary.splice(index, 1);
    }
}

function editBookFromLibrary(book) {
    currentEditingId = book.id;
    setBookFieldsToInput(book.title, book.author, book.pages, book.read);
}

function displayBooks() {
    const bookshelf = document.querySelector(".bookshelf");
    bookshelf.innerHTML = "";
    myLibrary.forEach((book) => {
        const card = document.createElement("article");
        card.classList.add("book");
        card.dataset.id = book.id;
        card.innerHTML = `
            <div class="side spine">
                <h2 class="spine__title">${book.title}</h2>
                <p class="spine__author">${book.author}</p>
            </div>
            <div class="side side--top"></div>
            <div class="side side--cover"></div>
            <button class="book__button book__button--remove">Remove Book</button>
            `;

        bookshelf.appendChild(card);
    });
}

// Add book to myLibrary when form submit
const dialog = document.querySelector("#add-book-dialog");
const form = document.querySelector("#add-book-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // If editing a book, update the properties
    if (currentEditingId) {
        const currentBook = myLibrary.find((book) => {
            return book.id === currentEditingId;
        });
        const updatedBook = getBookFieldsFromInput();
        currentBook.update(updatedBook);
        currentEditingId = null;
    } else {
        const newBook = getBookFieldsFromInput();
        addBookToLibrary(new Book(newBook.title, newBook.author, newBook.pages, newBook.read));
    }

    displayBooks();
    form.reset();
    dialog.close();
});

const bookshelf = document.querySelector(".bookshelf");
bookshelf.addEventListener("click", (event) => {
    const targetBook = myLibrary.find((book) => book.id === event.target.closest(".book").dataset.id);
    if (event.target.classList.contains("book__button--remove")) {
        removeBookFromLibrary(targetBook);
    } else {
        editBookFromLibrary(targetBook);
        dialog.showModal();
    }
});
