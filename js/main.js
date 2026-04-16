const myLibrary = [];

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

Book.prototype.toggleReadStatus = function () {
    this.read = !this.read;
};

addBookToLibrary(new Book("Harry", "J.K.", 129, true));
displayBooks();

function getBookFieldsFromInput() {
    const form = document.querySelector("#add-book-form");
    const bookTitle = form.elements["book-title"].value;
    const bookAuthor = form.elements["book-author"].value;
    const bookPages = form.elements["book-pages"].value;
    const bookStatus = form.elements["book-status"].checked;
    return new Book(bookTitle, bookAuthor, bookPages, bookStatus);
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
    myLibrary.splice(index, 1);
}

function editBookFromLibrary(book) {
    const dialog = document.querySelector("#add-book-dialog");
    const index = myLibrary.indexOf(book);
    setBookFieldsToInput(myLibrary[index].title, myLibrary[index].author, myLibrary[index].pages, myLibrary[index].status);
    dialog.showModal();
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
            <button class="book__button book__button--read">${book.read ? "Read" : "Not Read"}</button>
            <button class="book__button book__button--remove">Remove Book</button>
            `;

        bookshelf.appendChild(card);
    });
}

// Add book to myLibrary when button is clicked
const dialog = document.querySelector("#add-book-dialog");
const form = document.querySelector("#add-book-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newBook = getBookFieldsFromInput();
    addBookToLibrary(newBook);
    displayBooks();

    form.reset();
    dialog.close();
});

// Remove book from myLibrary and toggle read status
const bookshelf = document.querySelector(".bookshelf");
bookshelf.addEventListener("click", (event) => {
    const targetBook = myLibrary.find((book) => book.id === event.target.closest(".book").dataset.id);
    if (event.target.classList.contains("book__button--remove")) {
        removeBookFromLibrary(targetBook);
    } else if (event.target.classList.contains("book__button--read")) {
        targetBook.toggleReadStatus();
    } else {
        editBookFromLibrary(targetBook);
    }
    displayBooks();
});
