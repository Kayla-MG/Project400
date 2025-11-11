import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>CALM Page</Text>
      <Text>What does the user need?
      </Text>
      <Text>de-escalation tools or links to games that calm them</Text>
      <Text>Can we play calm music?  15 min timer to go for walk</Text>
      <Text>Darker calmer colours on this page</Text>
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