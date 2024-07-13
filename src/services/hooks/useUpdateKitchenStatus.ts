import {useMutation} from '@tanstack/react-query';
import {updateKitchenStatus, updateOrderStatus} from '../shiv';
import {ToastAndroid} from 'react-native';

const useUpdateKitchenStatus = () => {
  return useMutation({
    mutationFn: ({kitchenStatus}: any) => updateKitchenStatus(kitchenStatus),
    onSuccess: async data => {
      try {
        console.log('done');
        ToastAndroid.show('Kitchen Status updated ', ToastAndroid.SHORT);
      } catch (error) {
        console.log('error1');
      }
    },
    onError: error => {
      const message = console.log('error2');
      console.log(error.stack);
      ToastAndroid.show('Kitchen Status update failed ', ToastAndroid.SHORT);
    },
  });
};

export default useUpdateKitchenStatus;
