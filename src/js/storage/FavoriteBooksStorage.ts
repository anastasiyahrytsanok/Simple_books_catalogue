import { ExtendedBook } from "../../types/books";

const STORAGE_KEY = "favoriteBooks" as const;

export class FavoriteBooksStorage {
  getFavoriteBooks(): ExtendedBook[] {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }
    try {
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as ExtendedBook[];
    } catch {
      return [];
    }
  }

  addFavoriteBook(book: ExtendedBook): void {
    const newArray = this.getFavoriteBooks();
    newArray.push(book);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newArray));
  }

  deleteFavoriteBook(bookId: string): void {
    const books = this.getFavoriteBooks();
    const updatedBooks = books.filter((book) => book.key !== bookId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  }
}
