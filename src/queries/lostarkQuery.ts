'use client';

import { useQuery } from '@tanstack/react-query';

import api from '@/api';

const lostarkQuery = {
  useGetSiblingCharacters(searchNickname: string) {
    return useQuery({
      queryKey: ['lostark', 'siblingCharacters', searchNickname],
      queryFn: () => api.lostark.getSiblingCharacters(searchNickname),
      enabled: searchNickname.length > 0,
      retry: false,
    });
  },
};

export default lostarkQuery;
