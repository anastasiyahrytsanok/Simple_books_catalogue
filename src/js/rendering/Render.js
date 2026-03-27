const DATA_ID_ATTRIBUTE = "data-id";
const DATA_FAVORITE_ID_ATTRIBUTE = "data-favorite-id";
import likeFilledIcon from "../../assets/icons/LikeFilled.svg";
import likeEmptyGreyIcon from "../../assets/icons/LikeEmptyGrey.svg";

export class Render {
  constructor() {
    this.bookList = document.getElementById("bookList");
    this.favoriteBookList = document.getElementById("favorite-book__list");
    this.searchInputElement = document.getElementById("searchInput");
    this.searchButton = document.getElementById("searchBtn");
    this.searchBookForm = document.getElementById("search-book-form");
    this.favoritesSection = document.getElementById("favorites");
  }

  renderBooks(books, onBookClick) {
    if (books.length === 0) {
      this.bookList.replaceChildren(this.#createEmptyBookListElement());
    } else {
      const bookCards = books.map((book) =>
        this.#createBookCardElement(book, onBookClick),
      );
      this.bookList.replaceChildren(...bookCards);
    }
  }

  rerenderBook(book, onBookClick) {
    const oldBookCard = this.bookList.querySelector(
      `[${DATA_ID_ATTRIBUTE}="${book.key}"]`,
    );

    if (oldBookCard && oldBookCard.parentNode) {
      const newBookCard = this.#createBookCardElement(book, onBookClick);
      oldBookCard.parentNode.replaceChild(newBookCard, oldBookCard);
    }
  }

  renderFavoritesBooks(books, onLikeClick) {
    const favoriteBooksElements = books.map((book) =>
      this.#createFavoriteBookElement(book, onLikeClick),
    );
    this.favoriteBookList.replaceChildren(...favoriteBooksElements);
  }

  removeFavoriteBook(bookId) {
    const oldFavoriteBookElement = this.favoriteBookList.querySelector(
      `[${DATA_FAVORITE_ID_ATTRIBUTE}="${bookId}"]`,
    );

    if (oldFavoriteBookElement) {
      oldFavoriteBookElement.remove();
    }
  }

  addFavoriteBook(book, onLikeClick) {
    const newFavoriteBook = this.#createFavoriteBookElement(book, onLikeClick);
    this.favoriteBookList.appendChild(newFavoriteBook);
  }

  renderFavoriteBooksCount(count) {
    const favoriteBooksCountElement = document.getElementById(
      "favorites__name__description",
    );
    if (favoriteBooksCountElement) {
      favoriteBooksCountElement.innerText = `${count} books saved`;
    }
  }

  renderError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "book-list__error";
    errorElement.textContent = message;

    this.bookList.replaceChildren(errorElement);
  }

  renderLoading() {
    this.bookList.replaceChildren(this.#createLoadingElement());
  }

  setSearchDisabled(isDisabled) {
    if (this.searchButton) {
      this.searchButton.disabled = isDisabled;
    }

    if (this.searchInputElement) {
      this.searchInputElement.disabled = isDisabled;
    }
  }

  getSearchQuery() {
    return this.searchInputElement?.value.trim().toLowerCase() || "";
  }

  bindSearchSubmit(handler) {
    this.searchBookForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  bindSearchClick(handler) {
    this.searchButton?.addEventListener("click", handler);
  }

  hideFavorites() {
    this.favoritesSection.style.display = "none";
  }

  showFavorites() {
    this.favoritesSection.style.display = "";
  }

  #createBookCardElement(book, onBookClick) {
    const bookCardElement = document.createElement("div");
    bookCardElement.className = "book-card";
    bookCardElement.setAttribute(DATA_ID_ATTRIBUTE, book.key);

    const bookCoverElement = this.#createBookCoverElement(book, false);
    bookCardElement.appendChild(bookCoverElement);

    const title = document.createElement("h3");
    title.className = "book-card__title";
    title.textContent = book.title || "No title";
    bookCardElement.appendChild(title);

    const author = document.createElement("p");
    author.className = "book-card__author";
    author.textContent = book.author_name?.[0] || "Unknown author";
    bookCardElement.appendChild(author);

    const year = document.createElement("p");
    year.className = "book-card__year";
    year.textContent = book.first_publish_year || "—";
    bookCardElement.appendChild(year);

    const likeButtonElement = document.createElement("button");
    likeButtonElement.className = "like-button";

    const likeIcon = document.createElement("img");
    likeIcon.src = book.isFavorite ? likeFilledIcon : likeEmptyGreyIcon;

    likeButtonElement.appendChild(likeIcon);

    likeButtonElement.addEventListener("click", () => {
      onBookClick(book);
    });

    bookCardElement.appendChild(likeButtonElement);

    return bookCardElement;
  }

  #createFavoriteBookElement(book, onLikeClick) {
    const favoriteBookElement = document.createElement("div");
    favoriteBookElement.className = "favorite-book-block";
    favoriteBookElement.setAttribute("data-favorite-id", book.key);

    const favoriteBookCard = document.createElement("div");
    favoriteBookCard.className = "favorite-book-card";

    const bookCoverElement = this.#createBookCoverElement(book, true);
    favoriteBookCard.appendChild(bookCoverElement);

    const description = document.createElement("div");
    description.className = "favorite-book-card__description";

    const title = document.createElement("h3");
    title.className = "favorite-book-card__title";
    title.textContent = book.title || "No title";

    const author = document.createElement("p");
    author.className = "favorite-book-card__author";
    author.textContent = book.author_name?.[0] || "Unknown author";

    const year = document.createElement("p");
    year.className = "favorite-book-card__year";
    year.textContent = book.first_publish_year || "—";

    description.appendChild(title);
    description.appendChild(author);
    description.appendChild(year);

    favoriteBookCard.appendChild(description);

    const likeButtonElement = document.createElement("button");
    likeButtonElement.className = "favorites__like-button";

    const likeIcon = document.createElement("img");
    likeIcon.src = likeFilledIcon;

    likeButtonElement.appendChild(likeIcon);

    likeButtonElement.addEventListener("click", () => {
      onLikeClick(book);
    });

    favoriteBookElement.appendChild(favoriteBookCard);
    favoriteBookElement.appendChild(likeButtonElement);

    return favoriteBookElement;
  }

  #createLoadingElement() {
    const el = document.createElement("div");
    el.className = "book-list__loading";
    el.textContent = "Loading...";
    return el;
  }

  #createEmptyBookListElement() {
    const el = document.createElement("div");
    el.className = "book-list__empty";
    el.textContent = "No books found";
    return el;
  }

  #createBookCoverElement(book, isMini) {
    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : null;

    if (coverUrl) {
      const img = document.createElement("img");
      img.className = `${isMini ? "favorite-" : ""}book-card__image`;
      img.src = coverUrl;
      img.alt = book.title || "Book cover";
      return img;
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = `${isMini ? "favorite-" : ""}book-card__placeholder`;
      placeholder.textContent = "No cover";
      return placeholder;
    }
  }
}
