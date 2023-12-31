import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useEffectOnChangeURL(callback, dependencies) {

    const currLocation = useLocation();
    const prevLocation = useRef(location);

    useEffect(() => {
        if (prevLocation.current.pathname !== currLocation.pathname) {
            callback();
        }
      
        prevLocation.current = currLocation;

    }, [...dependencies, currLocation]);
}