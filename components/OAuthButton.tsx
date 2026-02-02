import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  GoogleSignin, GoogleSigninButton
} from '@react-native-google-signin/google-signin'
import { useAuth } from '@/hooks/authcontext'
interface Props {
  // The OAuthStrategy type from Clerk allows you to specify the provider you want to use in this specific instance of the OAuthButton component
  strategy: string,
  children: React.ReactNode
}

export default function OAuthButton({ strategy, children }: Props) {
  const router = useRouter()
  const {setUser,signInWithGoogle} = useAuth();
  const onPress = async () => {
     await signInWithGoogle(); 
  }

  return (
    <GoogleSigninButton
      style={{ width: 192, height: 48, marginBottom: 20 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={onPress}
    />
  )
}
