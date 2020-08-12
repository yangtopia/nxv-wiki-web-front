import { useState, useEffect } from 'react';

const SCROLL_UP = 'up';
const SCROLL_DOWN = 'down';

type ScrollState = 'top' | 'up' | 'down' | undefined;

interface Params {
  initialState?: ScrollState;
  thresholdPixels?: number;
  off?: boolean;
}

const useScrollDirection = ({
  initialState,
  thresholdPixels,
  off,
}: Params = {}): ScrollState => {
  const [scrollDir, setScrollDir] = useState(initialState);

  useEffect(() => {
    const threshold = thresholdPixels || 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }

      const currentScrollState = ((): ScrollState => {
        if (scrollY <= threshold || 0) {
          return 'top';
        }
        return scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP;
      })();

      setScrollDir(currentScrollState);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    /**
     * Bind the scroll handler if `off` is set to false.
     * If `off` is set to true reset the scroll direction.
     */
    if (!off) {
      window.addEventListener('scroll', onScroll);
    } else {
      setScrollDir(initialState);
    }
    // !off
    //   ? window.addEventListener('scroll', onScroll)
    //   : setScrollDir(initialState);

    return () => window.removeEventListener('scroll', onScroll);
  }, [initialState, thresholdPixels, off]);

  return scrollDir;
};

export default useScrollDirection;
