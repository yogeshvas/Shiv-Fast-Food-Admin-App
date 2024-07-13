import {useQuery} from '@tanstack/react-query';
import {getKitchenStatus} from '../shiv';

const useGetKitchenStatus = () => {
  return useQuery({
    queryKey: ['getKitchenStatus'],
    queryFn: getKitchenStatus,
  });
};

export default useGetKitchenStatus;
