const BASE_URL = "https://openlibrary.org";

export class BooksApi {
  async searchBooks(query) {
    if (!query) {
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search.json?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      return data.docs;
    } catch (error) {
      throw new Error("Failed to fetch books");
    }
  }
}
