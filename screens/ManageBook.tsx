import { StyleSheet, View, Text } from 'react-native'

interface Props {
  route: any
}

export const ManageBook: React.FC<Props> = ({
  route: {
    params: { volumeId, existingBook },
  },
}) => {
  console.log(volumeId, existingBook)
  return (
    <View>
      <Text>
        {/* TODO: Manage Book Modal
        - if existingBook, update book else add book
        - select bookshelf (Want to read, Currently reading, Read) 
        - mark as owned / not owned 
        - add/delete date read (automatically set bookshelf to "Read" if date added) 
        - add/delete rating (automatically set bookshelf to "Read" if rating added)
        - add/delete review (automatically set bookshelf to "Read" if review added) */}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({})
