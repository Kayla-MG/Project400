import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}
    screenOptions={{headerShown: false}}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "LOG",
        }}
      />
      <Tabs.Screen
        name="calm"
        options={{
          title: "CALM",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  )
}

export default TabLayout