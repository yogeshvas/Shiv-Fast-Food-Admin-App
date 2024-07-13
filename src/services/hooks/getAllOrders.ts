import {useQuery} from '@tanstack/react-query';
import {getAllOrders, getDashboardData} from '../shiv';

const useGetAllOrders = () => {
  return useQuery({
    queryKey: ['getAllOrders'],
    queryFn: getAllOrders,
  });
};

export default useGetAllOrders;
