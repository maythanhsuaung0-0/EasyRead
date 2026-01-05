import { Image } from 'expo-image';
import { View,Platform,Text, StyleSheet,SafeAreaView } from 'react-native';
import "../../global.css"
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
   <SafeAreaView style={{flex:1}} > 
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <HelloWave width={310} height={310} />
      }>
      <ThemedView style={{padding:20,alignItems:'center',justifyContent:'center'}}> 
        <ThemedText
          type="title"
          style={{
            fontSize:32,
            fontWeight:'bold',
          }}>
          Welcome to the App!
        </ThemedText>
      </ThemedView>
      <ThemedText style={{padding:20,fontSize:16,textAlign:'center'}}>
        This is the home screen of your Expo Router app. Use the navigation to explore different sections.
      </ThemedText>
      <Link href="/explore" style={{padding:20,alignItems:'center'}}>
        <ThemedText type="link" style={{fontSize:18}}>Go to Explore Screen</ThemedText>
      </Link>
    </ParallaxScrollView>
   </SafeAreaView>
  );
}
