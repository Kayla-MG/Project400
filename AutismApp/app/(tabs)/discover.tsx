import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>This is the LOG MOOD page</Text>
      <Text>User wil log their moods , feelings/meltdowns on this page </Text>
      <Text>This is their diary</Text>
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