import {useQuery} from '@tanstack/react-query';
import {getAcceptedOrders, getAllOrders, getDashboardData} from '../shiv';

const useGetAcceptedOrders = () => {
  return useQuery({
    queryKey: ['getAcceptedOrders'],
    queryFn: getAcceptedOrders,
  });
};

export default useGetAcceptedOrders;
