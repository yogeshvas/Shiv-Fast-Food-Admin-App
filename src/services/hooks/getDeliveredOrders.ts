import {useQuery} from '@tanstack/react-query';
import {
  getAcceptedOrders,
  getActiveOrders,
  getAllOrders,
  getDashboardData,
  getDeliveredOrders,
} from '../shiv';

const useGetDeliveredOrders = () => {
  return useQuery({
    queryKey: ['getDeliveredOrders'],
    queryFn: getDeliveredOrders,
  });
};

export default useGetDeliveredOrders;
