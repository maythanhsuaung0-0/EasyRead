import { getAllFiles } from '@/utils/fileMethods';
import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function FavouritesScreen() {
  const [files, setFiles] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const loadData = async () => {
    const { files, previews } = await getAllFiles(true,['.pdf', '.docx']);

    setFiles(files);
    setFilePreviews(previews);
    console.log('Loaded files:', files, previews);
  };
  useEffect(() => {
    (async () => {
      await loadData();
    }
    )();
  }
    , []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="px-10 py-16 grid gap-2">
          <View className="flex flex-row items-center justify-between">
 
          <Text className="font-bold text-3xl ">Your favourite Books</Text>
        </View>
        {/* Add your library content here */}
        <View className="flex flex-col gap-4 mb-4 mt-6">
          {files.length > 0 ? (
            files.map((file, index) => (
              <View key={index} className="flex flex-row gap-2">
                <Pressable className="my-1"
                >


                  <Image
                    source={filePreviews[file] ? { uri: filePreviews[file] } :
                      require('../../../assets/images/icon.png')}
                    className="w-28 h-32 mr-4 rounded-sm self-center border border-gray-200 object-top"
                  />
                </Pressable>
                <View className="flex-1  flex-col justify-between">
                  <Text className="text-lg mt-4 self-start">{file}</Text>
                  <View className="flex flex-row mt-auto mb-2">
                  </View>
                </View>
              </View>

            ))
          ) :
            (
              <View className="">
                <Text className="text-lg text-gray-600">No items in your library yet.</Text>
              </View>
            )}
        </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}
