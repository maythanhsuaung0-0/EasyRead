import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  GoogleSignin, GoogleSigninButton
} from '@react-native-google-signin/google-signin'
interface Props {
  // The OAuthStrategy type from Clerk allows you to specify the provider you want to use in this specific instance of the OAuthButton component
  strategy: string,
  children: React.ReactNode
}

export default function OAuthButton({ strategy, children }: Props) {
  const router = useRouter()
  const onPress = async () => {
   console.log('Google Sign-In button pressed');
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log({ userInfo: response.data });
      } else {
        console.log('Google sign in failed or was cancelled');
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            console.log('An error occurred during Google sign in', error);
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log('An unexpected error occurred during Google sign in', error);
      }
    }
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
