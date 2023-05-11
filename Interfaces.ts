export interface Book {
  // google books api data
  volumeId: string
  title: string
  author: string
  averageRating: number
  ratingsCount: number
  pagesCount: number
  image: string

  // custom data
  owned: boolean
  bookshelf: string
}
