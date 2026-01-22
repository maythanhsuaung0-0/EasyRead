import { View, Text,   ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="px-10 py-16">
          <Text className="font-bold text-3xl ">Quizzes</Text>
          <Text className="mt-4 text-lg text-gray-600">Test your knowledge of the books with our quizzes!</Text>
          {/* Add your library content here */}
          <View className="mt-6">
            <Text className="text-lg text-gray-600">No quizzes yet</Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
 
