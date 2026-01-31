import { useAuth } from '@/hooks/authcontext'
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  const {user,session} = useAuth()
  console.log("AuthRoutesLayout user:", user);
  if (user && session) {
  return <Redirect href={'/(tabs)/protected'} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
    </Stack>
  )
}
