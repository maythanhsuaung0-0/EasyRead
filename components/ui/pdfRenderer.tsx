import { View, Text,StyleSheet,Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
export default function PDFRenderer({ fileUri}: { fileUri: string }) {
  const source = { uri: fileUri ,cache: true};
  console.log('Rendering PDF from URI:', fileUri);
  return (
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        style={styles.pdf}
        onError={(error) => {
          console.log('PDF rendering error:', error);
        }}
        showsVerticalScrollIndicator={true}

      />
  );
}
const styles = StyleSheet.create({
    pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
