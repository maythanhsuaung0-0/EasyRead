import { View,Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function SettingsScreen() {
  const { user } = useUser()
  const extractedFirstName = user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'
  const router = useRouter()
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)')
  }
  return (
    <SafeAreaView>
      <ScrollView>

        <View className="px-10 py-16 grid gap-4">
          <View>
            <Text className="text-3xl font-bold">Settings</Text>
          </View>

          <View>
            {/* User Information */}
            <ThemedText type="subtitle" className='text-sm mt-2 mb-2'>User Information</ThemedText>
            <View className='flex flex-row items-center gap-4'>
              <View>
                <Image className='w-12 h-12 rounded-full block bg-transparent'
                source={{ uri: user?.imageUrl || '' }} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold">
                  {user?.firstName || extractedFirstName} {user?.lastName}
                </ThemedText>
                <ThemedText>{user?.emailAddresses[0].emailAddress}</ThemedText>
              </View>
            </View>

            {/* Sign Out Button */}
            <View className="mt-6">
              <TouchableOpacity 
              className='px-4 py-3 rounded-md bg-red-100' 
              onPress={handleSignOut}>
                <Text className='text-center text-red-500'>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


