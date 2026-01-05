import {View,Text} from 'react-native';

interface TopNavProps {
  userName?: string;
}
export default function TopNav({}: TopNavProps) {
  return <View className="py-14 px-10 flex flex-row gap-4 justify-between"> 
   <Text className="text-xl font-bold">Hello {userName}</Text>
    <View> 
    <Text>0</Text>
    <View></View>
    </View>
   </View>;
}
