import { ScrollView } from 'react-native';
import "../../../global.css"
import TopNav from '@/components/ui/topnav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const {user} = useUser();
  return (
   <SafeAreaView style={{flex:1}} > 
   <ScrollView style={{flex:1}}>
     <TopNav userName={user?.firstName || ""}
        avatarUrl={user?.imageUrl || undefined}
     />
       </ScrollView>
   </SafeAreaView>
  );
}
