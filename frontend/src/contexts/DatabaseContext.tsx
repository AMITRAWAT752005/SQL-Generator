import React, { createContext, useState, useEffect } from 'react';
import { databaseService, DBConnection } from '../services/database.service';

interface DatabaseContextType {
  connections: DBConnection[];
  activeConnection: DBConnection | null;
  isLoading: boolean;
  setActiveConnection: (conn: DBConnection | null) => void;
  addConnection: (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ) => Promise<DBConnection>;
  removeConnection: (id: string) => Promise<void>;
  testConnection: (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ) => Promise<boolean>;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<DBConnection[]>([]);
  const [activeConnection, setActiveConnectionState] = useState<DBConnection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load connections from service
  const loadConnections = () => {
    setIsLoading(true);
    try {
      const conns = databaseService.getConnections();
      setConnections(conns);

      // Restore active connection if persisted
      const savedActiveId = localStorage.getItem('sql_gen_active_conn_id');
      if (savedActiveId) {
        const found = conns.find((c) => c.id === savedActiveId);
        if (found) {
          setActiveConnectionState(found);
        } else if (conns.length > 0) {
          setActiveConnectionState(conns[0]);
          localStorage.setItem('sql_gen_active_conn_id', conns[0].id);
        }
      } else if (conns.length > 0) {
        setActiveConnectionState(conns[0]);
        localStorage.setItem('sql_gen_active_conn_id', conns[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const setActiveConnection = (conn: DBConnection | null) => {
    setActiveConnectionState(conn);
    if (conn) {
      localStorage.setItem('sql_gen_active_conn_id', conn.id);
    } else {
      localStorage.removeItem('sql_gen_active_conn_id');
    }
  };

  const addConnection = async (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ) => {
    const newConn = await databaseService.createConnection(name, type, host, port, database, username);
    setConnections(databaseService.getConnections());
    if (!activeConnection) {
      setActiveConnection(newConn);
    }
    return newConn;
  };

  const removeConnection = async (id: string) => {
    await databaseService.deleteConnection(id);
    const updated = databaseService.getConnections();
    setConnections(updated);
    if (activeConnection?.id === id) {
      if (updated.length > 0) {
        setActiveConnection(updated[0]);
      } else {
        setActiveConnection(null);
      }
    }
  };

  const testConnection = async (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ) => {
    return await databaseService.testConnection(name, type, host, port, database, username);
  };

  return (
    <DatabaseContext.Provider
      value={{
        connections,
        activeConnection,
        isLoading,
        setActiveConnection,
        addConnection,
        removeConnection,
        testConnection,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
