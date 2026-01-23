import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See Clerk docs: custom flows error handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)/protected')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
      console.log('error',signUpAttempt)
      }
    } catch (err) {
      // See Clerk docs: custom flows error handling
      // for more info on error handling
      console.log('error',err)
    }
  }

  if (pendingVerification) {
    return (
    <View className="flex-1 justify-center items-center p-6">
      <View className="w-full bg-white rounded-md p-10 max-w-md grid gap-4">
      <View className="items-center mb-4">
        <Text className="text-center font-bold text-xl">Welcome to Readorize</Text>
        <Text className="text-center text-gray-600 mt-2">
          Sign in to your account
        </Text>
      </View>

        <Text>Verify your email</Text>
        <TextInput
          value={code}
          className="border border-gray-300 rounded-md py-3 pl-6 px-4 text-lg"
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} className="bg-blue-500 rounded-md py-3 px-4 items-center">
          <Text className="text-white text-lg">Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
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
