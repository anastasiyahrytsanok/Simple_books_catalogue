export type Book = {
  author_key?: string[];
  author_name?: string[];
  cover_edition_key?: string;
  cover_i?: number;
  ebook_access?: string;
  edition_count?: number;
  first_publish_year?: number;
  has_fulltext?: boolean;
  ia?: string[];
  ia_collection?: string[];
  key: string;
  language?: string[];
  lending_edition_s?: string;
  lending_identifier_s?: string;
  public_scan_b?: boolean;
  title: string;
  id_librivox?: string[];
  id_project_gutenberg?: string[];
};

export type SearchBooksResponse = {
  docs: Book[];
};

export type ExtendedBook = Book & { isFavorite: boolean };
