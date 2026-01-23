import { ScrollView } from 'react-native';
import "../../../global.css"
import TopNav from '@/components/ui/topnav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const {user} = useUser();
  const extractedFirstName = user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "User";
  return (
   <SafeAreaView style={{flex:1}} > 
   <ScrollView style={{flex:1}}>
     <TopNav userName={user?.firstName || extractedFirstName} 
        avatarUrl={user?.imageUrl || undefined}
     />
       </ScrollView>
   </SafeAreaView>
  );
}
