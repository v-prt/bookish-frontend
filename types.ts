export type RootStackParamList = {
  BookDetails: { id: string }
}

export interface Book {
  id: string
  title: string
  author: string
  averageRating: number
  isbn: string
  isbn13: string
  num_pages: number
  image: string
}
