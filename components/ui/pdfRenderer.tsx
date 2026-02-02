import React, { useEffect, useRef,useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Pdf from 'react-native-pdf';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { supabase} from '@/utils/supabase';
import { useAuth } from '@/hooks/authcontext';
export default function PDFRenderer({ fileUri }: { fileUri: string }) {
  const router = useRouter()
  const {user} = useAuth()
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const source = { uri: fileUri, cache: true };
  const pdfRef = useRef<typeof Pdf>(null);

  const goToPage = (pageNumber: number) => {
    if (pdfRef.current) {
      pdfRef.current.setPage(pageNumber);
    }
  }
  const fetchPdfMetadata = async (fileUri: string) => {
    const bookTitle = fileUri.split('/').pop() || '';
    console.log('user',user)
    try{
    const { data, error } = await supabase 
      .from('reading_history')
    .select('*').eq('book_title', bookTitle)
    .eq('user_id', user?.id)
    console.log('Fetched PDF metadata:', data, error);
    if (data && data.length > 0) {
      setMetadata(data[0]);
    }
    }
    catch (error) {
      console.error('Error fetching PDF metadata:', error);
    }
  }
  const PostPdfMetadata = async (fileUri: string) => {
    const bookTitle = fileUri.split('/').pop() || '';
    console.log('Posting metadata for book:', bookTitle);
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
  useEffect(() => {
    fetchPdfMetadata(fileUri);
    if(metadata && metadata.end_page){
      setCurrentPage(metadata.end_page);
      goToPage(metadata.end_page);
    }
    else{
    }
  }
  , [fileUri]);
  return (
    <View className="relative">
      <View className="h-20 flex justify-center px-8 border-b border-gray-200">
        <View className="flex flex-row items-center gap-2">
          <Pressable onPress={() => { router.navigate("/protected/library") }} className="p-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Pressable onPress={() => { 
            activeTool === 'list' ? setActiveTool(null) : setActiveTool('list')
          }}
          className={activeTool === 'list' ? "bg-gray-200 p-2 rounded-full" : "p-2"}>
            <Ionicons name="list" size={24} color="black" />
          </Pressable>
          <Pressable onPress={() => { }} className="ml-auto p-2">
            <AntDesign name="highlight" size={24} color="black" />
          </Pressable>
          <Pressable onPress={() => { }} className="p-2">
            <Ionicons name="extension-puzzle" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <View className="border rounded-md w-24 absolute bottom-7 left-1/3 ml-5 z-50 bg-black/80 p-2 flex items-center justify-center">
        <Text className='text-white'>{currentPage} of {totalPages}</Text>
      </View>
      {activeTool === 'list' && (
        <View className="absolute top-20 left-0 w-2/3 h-full bg-white z-50 border-r border-gray-200 p-4">
          <Text className="font-bold text-lg mb-4">Table of Contents</Text>
          {tableOfContents ? (
            <View>
              {tableOfContents.map((item: any, index: number) => (
                <Pressable key={index} onPress={() => {
                  setActiveTool(null);
                  setTimeout(() => {
                    setCurrentPage(item.pageIndex + 1);
                    goToPage(item.pageIndex + 1);
                  }, 300);
                }
                } className="py-2 border-b border-gray-200">
                  <Text className="text-gray-800">{item.title}</Text>
                  <Text className="text-gray-500 text-sm">Page {item.pageIndex + 1}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text>No Table of Contents found.</Text>
          )}
        </View>
      )}
      <Pdf
      ref={pdfRef}
        source={source}
        onLoadComplete={(numberOfPages,filepath,{width,height},tableOfContents) => {
          console.log(`Number of pages: ${numberOfPages}`);
          console.log('table of content',tableOfContents)
          setTotalPages(numberOfPages);
          const toc = tableOfContents?.map((item: any) => ({
            title:item.title,
            pageIndex:item.pageIdx}));
          setTableOfContents(toc);

        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          setCurrentPage(page);
        }}
        style={styles.pdf}
        onError={(error) => {
          console.log('PDF rendering error:', error);
        }}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
