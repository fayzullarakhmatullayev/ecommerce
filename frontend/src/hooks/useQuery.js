import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getQueryParams = useCallback(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'priceRange') {
        params[key] = value.split(',').map(Number);
      } else {
        params[key] = value;
      }
    }
    return params;
  }, [searchParams]);

  const setQueryParams = useCallback(
    (params) => {
      const newParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            newParams[key] = value.join(',');
          } else {
            newParams[key] = String(value);
          }
        }
      });
      setSearchParams(newParams);
    },
    [setSearchParams]
  );

  return { getQueryParams, setQueryParams };
};