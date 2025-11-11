import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "LOG",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "saved",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings/LOGIN",
        }}
      />
    </Tabs>
  )
}

export default TabLayout