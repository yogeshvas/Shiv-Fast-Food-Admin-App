import {useQuery} from '@tanstack/react-query';
import {getActiveOrders} from '../shiv';

const useGetActiveOrders = () => {
  return useQuery({
    queryKey: ['getActiveOrders'],
    queryFn: getActiveOrders,
  });
};

export default useGetActiveOrders;
