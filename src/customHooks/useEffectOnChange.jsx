import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useEffectOnChange(callback, dependencies) {

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
            
        }
      
        callback();

    }, dependencies);
}