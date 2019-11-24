import {useEffect, useRef} from "react";
import { useLocation } from 'react-router'
import qs from 'qs'

function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function useQuery() {
    return qs.parse(useLocation().search, { ignoreQueryPrefix: true });
}

export {usePrevious, useQuery};
