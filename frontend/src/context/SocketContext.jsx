import { createContext, useContext, useState } from "react";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [lastNotification, setLastNotification] = useState(null);

  return (
    <SocketContext.Provider value={{ socket: null, lastNotification, setLastNotification }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
