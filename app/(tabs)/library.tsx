import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TopNav from '@/components/ui/topnav';

export default function LibraryScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="px-10 py-16 grid gap-2">
          <Text className="font-bold text-3xl ">Your Library</Text>
          {/* Add your library content here */}
          <View className="">
            <Text className="text-lg text-gray-600">No items in your library yet.</Text>
          </View>
         <View className="flex flex-row gap-3 items-center ">
          <Ionicons name="cloud-upload-outline" size={28} color="#2563EB" /> 
         <Text className="text-lg text-blue-600">Upload books to your library!</Text>
         </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

