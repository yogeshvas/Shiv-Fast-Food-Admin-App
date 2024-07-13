import {useQuery} from '@tanstack/react-query';
import {getDashboardData} from '../shiv';

const useGetDashboardData = () => {
  return useQuery({
    queryKey: ['getDashboardData'],
    queryFn: getDashboardData,
  });
};

export default useGetDashboardData;
