import { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { View, Text, Image,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import PdfPageImage from 'react-native-pdf-page-image';
import { useRouter } from 'expo-router';
export default function LibraryScreen() {
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
  const readFile = async (fileUri: string) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('wow', fileContent.substring(0, 200)); // Log first 100 characters
      return fileContent;
    }
    catch (error) {
      console.error('Error reading file:', error);
    }
  }
const getThumbnailUri = async (fileName:string) => {
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
      else{
        setFilePreviews(prev => ({ ...prev, [file]: '' }));
    }
    setFiles(fileSelections);
  }
  }
  useEffect(() => {
    getAllFiles();
  }
    , []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="px-10 py-16 grid gap-2">
          <Text className="font-bold text-3xl ">Your Library</Text>
          {/* Add your library content here */}
          {files.length > 0 ? (
            files.map((file, index) => (
              <Button key={index} mode="outlined" className="my-1" onPress={() => {
                console.log('Selected file:', file);
                const fileUri = FileSystem.documentDirectory + file;
                console.log('File URI:', fileUri);
                router.push(
                  {
                    pathname: '/library/[id]',
                    params: { id: fileUri }
                  }
                )
              }
              }>
              <Image
                source={filePreviews[file] ? { uri: filePreviews[file] } : require('../../../assets/images/icon.png')}
                className="w-12 h-16 mr-4"
              />
              <Text className="text-lg">{file}</Text>

              </Button>
            ))
          ) :
            (
              <View className="">
                <Text className="text-lg text-gray-600">No items in your library yet.</Text>
              </View>
            )}
          <View className="flex flex-row gap-3 items-center ">
            <Button mode="contained" onPress={() => {
              pickDocument();
            }} icon="cloud-upload">Upload Books to the Library</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
