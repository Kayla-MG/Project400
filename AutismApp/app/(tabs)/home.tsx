import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {}

const Page = (props: Props) => {
  const {top:safeTop} = useSafeAreaInsets();
  return (
    <View style={[styles.container,{paddingTop:safeTop}]}>
      <Text>Home Screen</Text>
      <Text>This will display like a emoji face in the left corner with the face of user logged in</Text>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})