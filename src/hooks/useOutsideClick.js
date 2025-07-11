import { useEffect, useRef } from 'react';

/**
 * Hook to detect clicks outside of a referenced element
 * @param {Function} callback - Function to call when an outside click is detected
 */
const useOutsideClick = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback?.();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;
