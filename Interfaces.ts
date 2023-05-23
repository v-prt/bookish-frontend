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
  _id?: string
  owned?: boolean
  bookshelf?: string
  rating?: number
  review?: {
    text: string
    date: string
  }
  dateRead?: string
}
