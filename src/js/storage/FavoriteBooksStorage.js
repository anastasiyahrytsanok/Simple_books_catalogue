export class FavoriteBooksStorage {
  constructor() {}

  getFavoriteBooks() {
    return JSON.parse(localStorage.getItem("favoriteBooks")) ?? [];
  }

  addFavoriteBook(book) {
    const newArray = this.getFavoriteBooks();
    newArray.push(book);

    localStorage.setItem("favoriteBooks", JSON.stringify(newArray));
  }

  deleteFavoriteBook(bookId) {
    const books = this.getFavoriteBooks();
    const updatedBooks = books.filter((book) => book.key !== bookId);

    localStorage.setItem("favoriteBooks", JSON.stringify(updatedBooks));
  }
}
