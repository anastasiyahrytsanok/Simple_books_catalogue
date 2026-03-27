import { BooksApi } from "../services/BooksApi";
import { Render } from "../rendering/Render";
import { FavoriteBooksStorage } from "../storage/FavoriteBooksStorage";

const DEFAULT_SEARCH_QUERY = "austen";

export class App {
  constructor() {
    this.bookApi = new BooksApi();
    this.render = new Render();
    this.favoriteBooksStorage = new FavoriteBooksStorage();

    this.handleLikeClick = this.#onLikeClick.bind(this);
    this.handleFavoriteLikeClick = this.#onFavoriteLikeClick.bind(this);
  }

  async init() {
    try {
      await this.#renderInitialBooks();
      this.#subscribeHandlers();
      this.#renderFavoriteSection();
    } catch (error) {
      this.render.renderError("Failed to load books");
    }
  }

  async #renderInitialBooks() {
    this.render.hideFavorites();
    const books = await this.#fetchBooks(DEFAULT_SEARCH_QUERY);
    this.#markFavoriteBooks(books);
    this.books = books;
    this.render.renderBooks(books, this.handleLikeClick);
    this.render.showFavorites();
  }

  #renderFavoriteSection() {
    const favoriteBooks = this.#getFavoriteBooks();
    this.render.renderFavoritesBooks(
      favoriteBooks,
      this.handleFavoriteLikeClick,
    );
    this.render.renderFavoriteBooksCount(favoriteBooks.length);
  }

  #subscribeHandlers() {
    this.render.bindSearchSubmit(() => this.#handleSearch());
    this.render.bindSearchClick(() => this.#handleSearch());
  }

  #onLikeClick(book) {
    const { key: bookId, isFavorite: currentIsFavorite } = book;

    if (currentIsFavorite) {
      this.favoriteBooksStorage.deleteFavoriteBook(bookId);
      this.render.removeFavoriteBook(bookId);
    } else {
      this.favoriteBooksStorage.addFavoriteBook(book);
      this.render.addFavoriteBook(book, this.handleFavoriteLikeClick);
    }

    book.isFavorite = !currentIsFavorite;
    this.render.rerenderBook(book, this.handleLikeClick);
    this.#updateFavoriteBooksCount();
  }

  #onFavoriteLikeClick(book) {
    const { key: bookId } = book;

    this.favoriteBooksStorage.deleteFavoriteBook(bookId);

    book.isFavorite = false;
    this.render.rerenderBook(book, this.handleLikeClick);
    this.render.removeFavoriteBook(bookId);
    this.#updateFavoriteBooksCount();
  }

  #markFavoriteBooks(books) {
    const favoriteBooks = this.#getFavoriteBooks();
    const favoriteKeys = new Set(favoriteBooks.map((book) => book.key));

    books.forEach((book) => {
      book.isFavorite = favoriteKeys.has(book.key);
    });
  }

  async #handleSearch() {
    try {
      const query = this.render.getSearchQuery();

      if (!query) {
        return;
      }

      this.render.setSearchDisabled(true);

      const books = await this.#fetchBooks(query);
      this.#markFavoriteBooks(books);
      this.books = books;
      this.render.renderBooks(books, this.handleLikeClick);
    } catch (error) {
      this.render.renderError("Failed to search books");
      console.error(error);
    } finally {
      this.render.setSearchDisabled(false);
    }
  }

  #updateFavoriteBooksCount() {
    const favoriteBooks = this.#getFavoriteBooks();
    this.render.renderFavoriteBooksCount(favoriteBooks.length);
  }

  #fetchBooks(query) {
    this.render.renderLoading();
    return this.bookApi.searchBooks(query);
  }

  #getFavoriteBooks() {
    return this.favoriteBooksStorage.getFavoriteBooks();
  }
}
