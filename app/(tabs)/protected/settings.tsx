import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useAuth, useUser } from '@clerk/clerk-expo'

export default function SettingsScreen() {
  const { user } = useUser()
  const { signOut } = useAuth()

  return (

    <View className="px-10 py-16 grid gap-4">
      <View>
        <ThemedText type="title">Settings</ThemedText>
      </View>

      <View>
        {/* User Information */}
        <ThemedText type="subtitle" className='text-sm mb-2'>User Information</ThemedText>
        <View style={styles.userContainer}>
          <View style={styles.userImageContainer}>
            <Image source={{ uri: user?.imageUrl || '' }} style={styles.userImage} />
          </View>
          <View style={styles.userInfoContainer}>
            <ThemedText type="defaultSemiBold">
              {user?.firstName} {user?.lastName}
            </ThemedText>
            <ThemedText>{user?.emailAddresses[0].emailAddress}</ThemedText>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutButtonContainer}>
          <TouchableOpacity onPress={() => signOut()}>
            <ThemedText style={{ color: 'red' }}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  userContainer: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  userInfoContainer: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: 'transparent',
  },
  userImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  signOutButtonContainer: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
  },
})
