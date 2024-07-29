import {useQuery} from '@tanstack/react-query';
import {getMenu} from '../shiv';

const useGetMenu = () => {
  return useQuery({
    queryKey: ['getMenu'],
    queryFn: getMenu,
  });
};

export default useGetMenu;
