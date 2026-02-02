import * as React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'

export default function SignUpScreen() {
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {

    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: emailAddress,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
 <View className="flex-1 justify-center items-center p-6">
      <View className="w-full bg-white rounded-md p-10 max-w-md grid gap-4">
      <View className="items-center mb-4">
        <Text className="text-center font-bold text-xl">Welcome to Readorize</Text>
        <Text className="text-center text-gray-600 mt-2">
          Create your account
        </Text>
      </View>
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
        onPress={onSignUpPress}>
          <Text className="text-white text-lg">Sign In</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/" className="text-blue-500">
            <Text>Sign Up</Text>
          </Link>
        </View>
      </View>
    </View>

  )
}
