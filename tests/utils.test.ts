import { describe, it, expect } from 'vitest'
import { sanitizeText } from '../utils'

describe('sanitizeText()', () => {
  it('should replace whitespace with plus signs', () => {
    const text = '  harry potter  '
    const result = sanitizeText(text)
    expect(result).toBe('harry+potter')
  })

  it('should replace multiple plus signs with single plus sign', () => {
    const text = 'harry++potter'
    const result = sanitizeText(text)
    expect(result).toBe('harry+potter')
  })

  it('should return an empty string if the text is empty', () => {
    const text = ''
    const result = sanitizeText(text)
    expect(result).toBe('')
  })

  it('should return an empty string if the text is only whitespace', () => {
    const text = '   '
    const result = sanitizeText(text)
    expect(result).toBe('')
  })

  it('should handle text containing special characters', () => {
    const text = 'JavaScript & jQuery: The Missing Manual'
    const result = sanitizeText(text)
    expect(result).toBe('JavaScript+&+jQuery:+The+Missing+Manual')
  })

  it('should handle text containing colons', () => {
    const text = 'The Adventures of Huckleberry Finn: Tom Sawyer Abroad'
    const result = sanitizeText(text)
    expect(result).toBe('The+Adventures+of+Huckleberry+Finn:+Tom+Sawyer+Abroad')
  })

  it('should handle long text inputs', () => {
    const text =
      'The Catcher in the Rye is a novel by J.D. Salinger, published in 1951. It is a story of Holden Caulfield, a teenage boy who has been expelled from prep school. The novel explores themes of alienation, identity, and loss of innocence, and has become a classic of modern American literature.'
    const result = sanitizeText(text)
    expect(result).toBe(
      'The+Catcher+in+the+Rye+is+a+novel+by+J.D.+Salinger,+published+in+1951.+It+is+a+story+of+Holden+Caulfield,+a+teenage+boy+who+has+been+expelled+from+prep+school.+The+novel+explores+themes+of+alienation,+identity,+and+loss+of+innocence,+and+has+become+a+classic+of+modern+American+literature.'
    )
  })

  it('should handle text containing numbers', () => {
    const text = 'The 100'
    const result = sanitizeText(text)
    expect(result).toBe('The+100')
  })

  it('should handle text containing punctuation', () => {
    const text = 'The Catcher in the Rye!'
    const result = sanitizeText(text)
    expect(result).toBe('The+Catcher+in+the+Rye!')
  })
})
