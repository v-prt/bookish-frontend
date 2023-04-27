export type RootStackParamList = {
  BookDetails: { id: string }
}

export interface Book {
  id: string
  title: string
  author: string
  averageRating: number
  ratingsCount: number
  pagesCount: number
  image: string
  isbn: string
  isbn13: string
}
