import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>This will display like a emoji face in the right corner 
        with what mood the user has logged</Text>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})