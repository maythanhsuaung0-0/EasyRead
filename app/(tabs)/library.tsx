import React, { useState,useEffect } from 'react';
import { Button } from 'react-native-paper';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
export default function LibraryScreen() {
  const [files, setFiles] = useState<string[]>([]);
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
        encoding: FileSystem.EncodingType.UTF8,
      });
      return fileContent;
    }
    catch (error) {
      console.error('Error reading file:', error);
    }
  }
  const getAllFiles = async () => {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || '');
    setFiles(files.filter(file => file.endsWith('.pdf') || file.endsWith('.docx') || file.endsWith('.epub')));
    console.log('Files in document directory:', files);
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
                readFile(fileUri).then(content => {
                  console.log('File content:', content);
                }).catch(error => {
                  console.error('Error reading file content:', error);
                }
                );
              }
              }>
              <View key={index}>
                <Text className="text-lg text-gray-800">{file}</Text>
              </View>
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

