import { useState, useEffect, SetStateAction } from 'react';
import _throttle from 'lodash/throttle';

interface Params {
  callback: () => any;
  threshold?: number;
}

const useInfiniteScroll = ({
  callback,
  threshold = 0,
}: Params): [boolean, (value: SetStateAction<boolean>) => void] => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const delayedCallback = _throttle(callback, threshold);

  useEffect(() => {
    if (!isFetching) return;
    delayedCallback();
  }, [isFetching]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
  };

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
