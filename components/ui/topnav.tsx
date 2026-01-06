import {View,Text} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface TopNavProps {
  userName?: string;
}
export default function TopNav({userName}: TopNavProps) {
  return <View className="py-16 px-10 flex flex-row gap-4 justify-between"> 
   <Text className="text-3xl font-bold">Hello {userName}</Text>
    <View className="flex flex-row gap-4 items-center"> 
    <View className="rounded-full border-4 border-blue-100 h-10 w-10 flex items-center justify-center">
    <Text className="text-blue-400 font-bold">0</Text>
    </View>
    <View className="rounded-full bg-gray-200 p-2">
    <AntDesign name="user" size={20} color="black" />
    </View>
    </View>
   </View>;
}
