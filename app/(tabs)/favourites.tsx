import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TopNav from '@/components/ui/topnav';

export default function FavouritesScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="px-10 py-16">
          <Text className="font-bold text-3xl ">Your favourite Books</Text>
          <View className="mt-6">
            <Text className="text-lg text-gray-600">You have no favourite books yet.</Text>
          </View>
</View> 
      </ScrollView>
    </SafeAreaView>
  );
}
