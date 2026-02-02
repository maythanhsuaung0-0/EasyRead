import { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import PdfPageImage from 'react-native-pdf-page-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/hooks/authcontext';
export default function LibraryScreen() {
  const { user } = useAuth()
  const [files, setFiles] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const persistFile = async (tempUri: string, fileName: string) => {
    const permanentUri = FileSystem.documentDirectory + fileName;

    // Moves file from temporary cache to permanent internal storage
    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri
    });

    return permanentUri;
  };
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/docx', 'application/epub+zip'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const { name, size, uri } = result.assets[0];
        console.log('Name:', name);
        console.log('URI:', uri);
        const permanentUri = await persistFile(uri, name);
        setFiles((prevFiles) => [...prevFiles, permanentUri.split('/').pop() || name]);
      } else {
        console.log('User canceled the picker');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const getThumbnailUri = async (fileName: string) => {
    const fullPdfPath = `${FileSystem.documentDirectory}${fileName}`;
    const thumbCachePath = `${FileSystem.cacheDirectory}${fileName}.png`;
    const info = await FileSystem.getInfoAsync(thumbCachePath);
    if (info.exists) {
      return thumbCachePath;
    }
    if (fileName.endsWith('.pdf')) {
      try {
        const result = await PdfPageImage.generate(fullPdfPath, 0, 0.5);
        // Move the result to our organized cache path
        await FileSystem.moveAsync({
          from: result.uri,
          to: thumbCachePath
        });
        return thumbCachePath;
      } catch (e) {
        console.error("Thumbnail failed", e);
        return null;
      }
    }

    return null;
  };

  const getAllFiles = async () => {
    const scale = 1.0;
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || '');
    const fileSelections = files.filter(file => file.endsWith('.pdf') || file.endsWith('.docx') || file.endsWith('.epub'))
    for (const file of fileSelections) {
      const thumbUri = await getThumbnailUri(file);
      if (thumbUri) {
        setFilePreviews(prev => ({ ...prev, [file]: thumbUri }));
      }
      else {
        setFilePreviews(prev => ({ ...prev, [file]: '' }));
      }
    }
    setFiles(fileSelections);
    console.log('Files in library:', fileSelections);

  }
  useEffect(() => {
    getAllFiles();
  }
    , []);
  const PostPdfMetadata = async (fileUri: string) => {
    const bookTitle = fileUri.split('/').pop() || '';
    console.log('Posting metadata for book:', fileUri);
    try {
      const { data, error } = await supabase
        .from('reading_history')
        .insert({
          user_id: user?.id,
          book_title: bookTitle,
          author: 'Unknown',
          started_at: new Date().toISOString(),
          start_page: 1,
          created_at: new Date().toISOString(),
        });
      if (error) {
        console.error('Error posting PDF metadata:', error);
      }
    } catch (error) {
      console.error('Error posting PDF metadata:', error);
    }
  }

  const onRead = (file: string) => {
    const fileUri = FileSystem.documentDirectory + file;
    console.log('File URI:', fileUri);
    PostPdfMetadata(fileUri);
    router.push(
      {
        pathname: '/protected/library/[id]',
        params: { id: fileUri }
      }
    )
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="px-10 py-16 grid gap-2">
          <View className="flex flex-row items-center justify-between">
            <Text className="font-bold text-3xl ">Your Library</Text>
            <View className="flex flex-row gap-3 items-center">
              <Button mode="contained" onPress={() => {
                pickDocument();
              }} icon="cloud-upload">Upload Books</Button>
            </View>
          </View>
          {/* Add your library content here */}
          <View className="flex flex-col gap-4 mb-4 mt-6">
            {files.length > 0 ? (
              files.map((file, index) => (
                <View key={index} className="flex flex-row gap-2">
                  <Pressable className="my-1" onPress={()=>onRead(file)}>


                    <Image
                      source={filePreviews[file] ? { uri: filePreviews[file] } : require('../../../../assets/images/icon.png')}
                      className="w-28 h-32 mr-4 rounded-sm self-center border border-gray-200 object-top"
                    />
                  </Pressable>
                  <View className="flex-1  flex-col justify-between">
                    <Text className="text-lg mt-4 self-start">{file}</Text>
                    <View className="flex flex-row mt-auto mb-2">
                      <Pressable className="p-3">
                        <Ionicons name="book-outline" size={20} color="#000" />
                      </Pressable>
                      <Pressable className="p-3">
                        <Ionicons name="trash-outline" size={20} color="#000" />
                      </Pressable>
                      <Pressable className="p-3"
                      >
                        <Ionicons name="heart-outline" size={20} color="#000" />
                      </Pressable>
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

