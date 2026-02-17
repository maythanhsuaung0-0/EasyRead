import PdfPageImage from 'react-native-pdf-page-image';
import * as FileSystem from 'expo-file-system/legacy';


/* *  @param {string} fileName - The name of the file for which to generate a thumbnail
 *  @returns {Promise<string|null>} - URI of the generated thumbnail or null if generation fails
 *  */
export const getThumbnailUri = async (fileName: string) => {
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

/*  
 *  @param {Array<string>} extensions - Array of file extensions to filter by (e.g., ['pdf', 'docx'])
 *  @returns {Promissse<{files:string[],previewss:Record<string, string>}>} - Object containing the list of files and their corresponding preview URIs
 *  */
export const getAllFiles = async (isFav:boolean,extensions = ['pdf', 'docx', 'epub']) => {
  try {
    const directory = isFav?(FileSystem.documentDirectory + 'favourites/'):FileSystem.documentDirectory;
    console.log("Checking isFav", isFav);
    console.log("Reading directory", directory);
    if (!directory) {
      return { files: [], previews: {} };
    }
    const allFiles = await FileSystem.readDirectoryAsync(directory);

    // Filter files based on provided extensions
    const filteredFiles = allFiles.filter(file =>
      extensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()))
    );

    const previews: Record<string,string> = {};

    // Process thumbnails
    await Promise.all(
      filteredFiles.map(async (file) => {
        const thumbUri = await getThumbnailUri(file);
        previews[file] = thumbUri || '';
      })
    );

    return {
      files: filteredFiles,
      previews: previews
    };
  } catch (error) {
    console.error("Error fetching library files:", error);
    return { files: [], previews: {} };
  }
}
