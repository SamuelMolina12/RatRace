import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket } from "../sockets/socketClient";
import { SOCKET_EVENT } from "../sockets/socketEvents";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: new Set(),
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated && user) {
      const s = connectSocket(user.id);
      setSocket(s);

      s.on(SOCKET_EVENT.USER_ONLINE, ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });
      });

      s.on(SOCKET_EVENT.USER_OFFLINE, ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      s.on(SOCKET_EVENT.USERS_ONLINE_LIST, ({ userIds }: { userIds: string[] }) => {
        setOnlineUsers(new Set(userIds));
      });

      return () => {
        disconnectSocket();
        setSocket(null);
        setOnlineUsers(new Set());
      };
    } else {
      disconnectSocket();
      setSocket(null);
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  return useContext(SocketContext);
}
