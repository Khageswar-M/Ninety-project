import NetInfo from '@react-native-community/netinfo';
import { createContext, useEffect, useState } from 'react';

export const NetworkContext = createContext(true);

export function NetworkProvider({children}){

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener((state) => {

            const online = 
                state.isConnected === true &&
                state.isInternetReachable !== false;

            setIsOnline(online);
        });

        return unsubscribe;
    }, []);

    return (
        <NetworkContext.Provider value={isOnline}>
            {children}
        </NetworkContext.Provider>
    )
}