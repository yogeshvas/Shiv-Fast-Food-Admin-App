import {useMutation} from '@tanstack/react-query';
import {updateKitchenStatus, updateMenu, updateOrderStatus} from '../shiv';
import {ToastAndroid} from 'react-native';

const useUpdateMenu = () => {
  return useMutation({
    mutationFn: ({id, price, availability}: any) =>
      updateMenu(id, price, availability),
    onSuccess: async data => {
      try {
        console.log('done');
        ToastAndroid.show(`${data.name} updated `, ToastAndroid.SHORT);
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

export default useUpdateMenu;
