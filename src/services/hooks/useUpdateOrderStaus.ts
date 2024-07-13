import {useMutation} from '@tanstack/react-query';
import {updateOrderStatus} from '../shiv';
import {ToastAndroid} from 'react-native';

const useUpdateOrderStaus = () => {
  return useMutation({
    mutationFn: ({orderId, status}: any) => updateOrderStatus(orderId, status),
    onSuccess: async data => {
      try {
        console.log('done');
        ToastAndroid.show('Order updated ', ToastAndroid.SHORT);
      } catch (error) {
        console.log('error');
      }
    },
    onError: error => {
      const message = console.log('error');
      console.log(message);
      ToastAndroid.show('Order not  updated ', ToastAndroid.SHORT);
    },
  });
};

export default useUpdateOrderStaus;
