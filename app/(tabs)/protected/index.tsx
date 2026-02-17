import { ScrollView } from 'react-native';
import "../../../global.css"
import TopNav from '@/components/ui/topnav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/authcontext';

export default function HomeScreen() {
  const { user } = useAuth();
  console.log('User in HomeScreen:', user);
  return (
   <SafeAreaView style={{flex:1}} > 
   <ScrollView style={{flex:1}}>
     <TopNav userName={user?.name} 
        avatarUrl={user?.profile || undefined}
     />
       </ScrollView>
   </SafeAreaView>
  );
}
