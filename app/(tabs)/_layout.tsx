import { useAuth } from '@/hooks/authcontext'
import { Stack } from 'expo-router'

export default function AppLayout() {
  const { user,session} = useAuth()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public routes */}
      <Stack.Protected guard={!user || !session}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signUp" />
      </Stack.Protected>

      {/* Protected routes */}
      <Stack.Protected guard={user!}>
        <Stack.Screen name="protected" />
      </Stack.Protected>
    </Stack>
  )
}
