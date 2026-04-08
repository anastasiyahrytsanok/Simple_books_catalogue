import { Book, SearchBooksResponse } from "../../types/books";

const BASE_URL = "https://openlibrary.org" as const;

export class BooksApi {
  async searchBooks(query: string): Promise<Book[]> {
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

      const data: SearchBooksResponse = await response.json();

      if (!data || !Array.isArray(data.docs)) {
        throw new Error("Invalid API response");
      }

      return data.docs;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch books: ${error.message}`);
      }

      throw new Error("Failed to fetch books");
    }
  }
}
