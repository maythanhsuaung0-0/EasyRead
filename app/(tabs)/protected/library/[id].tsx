import PdfRenderer from '@/components/ui/pdfRenderer';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PDFViewer() {
  const {id} = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {id ? (
          <PdfRenderer fileUri={id} /> 
        ) : (
          <Text>No PDF file specified.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
