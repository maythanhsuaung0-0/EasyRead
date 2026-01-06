import { Image } from 'expo-image';
import { View,Platform,Text, StyleSheet,SafeAreaView,ScrollView } from 'react-native';
import "../../global.css"
import { HelloWave } from '@/components/hello-wave';
import TopNav from '@/components/ui/topnav';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
   <SafeAreaView style={{flex:1}} > 
   <ScrollView style={{flex:1}}>
     <TopNav userName="May"/>
   </ScrollView>
   </SafeAreaView>
  );
}
