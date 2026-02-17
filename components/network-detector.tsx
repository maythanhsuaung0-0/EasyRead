import { useNetInfo } from '@react-native-community/netinfo';
import { Text } from 'react-native';

function NetworkInfo() {
  const netInfo = useNetInfo();
  // e.g., netInfo.isConnected, netInfo.type, netInfo.isInternetReachable
  return (
    <Text>
      {netInfo.isConnected ? 'Online' : 'Offline'}
    </Text>
  );
}
export default NetworkInfo;
