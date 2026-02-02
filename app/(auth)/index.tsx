import { Link, useRouter } from 'expo-router'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OAuthButton from '@/components/OAuthButton'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/hooks/authcontext'

export default function Page() {
  const router = useRouter()
  const { signInWithEmail } = useAuth()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    try {
      setLoading(true)
      await signInWithEmail(emailAddress, password)
      setLoading(false)
    } catch (error) {
      console.log('Error during sign-in:', error)
    }

  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="w-full bg-white rounded-md p-10 max-w-md grid gap-4">
        <View className="items-center mb-4">
          <Text className="text-center font-bold text-xl">Welcome to Readorize</Text>
          <Text className="text-center text-gray-600 mt-2">
            Sign in to your account
          </Text>
        </View>
        <OAuthButton strategy='oauth_google' >Sign In with Google</OAuthButton>
        <TextInput
          className="border border-gray-300 rounded-md text-lg py-3 px-4 "
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          className="border border-gray-300 rounded-md py-3 px-4 text-lg"
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-md py-3 px-4 items-center"
          onPress={onSignInPress}>
          <Text className="text-white text-lg">Sign In</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Don't have an account?</Text>
          <Link href="/signUp" className="text-blue-500">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  )
}
