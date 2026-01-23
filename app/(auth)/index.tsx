import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OAuthButton from '@/components/OAuthButton'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See Clerk docs: custom flows error handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
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
