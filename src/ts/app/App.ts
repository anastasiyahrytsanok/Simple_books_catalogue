import { Book, ExtendedBook } from "../../types/books";
import { Render } from "../rendering/Render";
import { BooksApi } from "../services/BooksApi";
import { FavoriteBooksStorage } from "../storage/FavoriteBooksStorage";

const DEFAULT_SEARCH_QUERY = "austen" as const;

export class App {
  readonly bookApi: BooksApi;
  readonly render: Render;
  readonly favoriteBooksStorage: FavoriteBooksStorage;
  books: ExtendedBook[] = [];

  handleLikeClick: (book: ExtendedBook) => void;
  handleFavoriteLikeClick: (book: ExtendedBook) => void;

  constructor() {
    this.bookApi = new BooksApi();
    this.render = new Render();
    this.favoriteBooksStorage = new FavoriteBooksStorage();

    this.handleLikeClick = this.#onLikeClick.bind(this);
    this.handleFavoriteLikeClick = this.#onFavoriteLikeClick.bind(this);
  }

  async init(): Promise<void> {
    try {
      await this.#renderInitialBooks();
      this.#subscribeHandlers();
      this.#renderFavoriteSection();
    } catch (error: unknown) {
      this.render.renderError("Failed to load books");
    }
  }

  async #renderInitialBooks(): Promise<void> {
    this.render.hideFavorites();
    const books = await this.#fetchBooks(DEFAULT_SEARCH_QUERY);
    const markedBooks = this.#markFavoriteBooks(books);
    this.render.renderBooks(markedBooks, this.handleLikeClick);
    this.render.showFavorites();
  }

  #renderFavoriteSection(): void {
    const favoriteBooks = this.#getFavoriteBooks();
    this.render.renderFavoritesBooks(
      favoriteBooks,
      this.handleFavoriteLikeClick,
    );
    this.render.renderFavoriteBooksCount(favoriteBooks.length);
  }

  #subscribeHandlers(): void {
    this.render.bindSearchSubmit(() => this.#handleSearch());
    this.render.bindSearchClick(() => this.#handleSearch());
  }

  #onLikeClick(book: ExtendedBook): void {
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

  #onFavoriteLikeClick(book: ExtendedBook): void {
    const { key: bookId } = book;

    this.favoriteBooksStorage.deleteFavoriteBook(bookId);

    book.isFavorite = false;
    this.render.rerenderBook(book, this.handleLikeClick);
    this.render.removeFavoriteBook(bookId);
    this.#updateFavoriteBooksCount();
  }

  #markFavoriteBooks(books: Book[]): ExtendedBook[] {
    const favoriteBooks = this.#getFavoriteBooks();

    const favoriteKeys = new Set(favoriteBooks.map((book) => book.key));

    return books.map((book) => ({
      ...book,
      isFavorite: favoriteKeys.has(book.key),
    }));
  }

  async #handleSearch(): Promise<void> {
    try {
      const query = this.render.getSearchQuery();

      if (!query) {
        return;
      }

      this.render.setSearchDisabled(true);

      const books = await this.#fetchBooks(query);
      const markedBooks = this.#markFavoriteBooks(books);
      this.render.renderBooks(markedBooks, this.handleLikeClick);
    } catch (error: unknown) {
      this.render.renderError("Failed to search books");
      console.error(error);
    } finally {
      this.render.setSearchDisabled(false);
    }
  }

  #updateFavoriteBooksCount(): void {
    const favoriteBooks = this.#getFavoriteBooks();
    this.render.renderFavoriteBooksCount(favoriteBooks.length);
  }

  #fetchBooks(query: string): Promise<Book[]> {
    this.render.renderLoading();
    return this.bookApi.searchBooks(query);
  }

  #getFavoriteBooks(): ExtendedBook[] {
    return this.favoriteBooksStorage.getFavoriteBooks();
  }
}
