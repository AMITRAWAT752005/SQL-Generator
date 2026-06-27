import { apiClient } from './api';

export interface ColumnSchema {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyRef?: { table: string; column: string };
}

export interface TableSchema {
  tableName: string;
  columns: ColumnSchema[];
}

export interface DBConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
  host: string;
  port: number;
  database: string;
  username: string;
  status: 'connected' | 'error' | 'disconnected';
  schema: TableSchema[];
  createdAt: string;
}

const CONNECTIONS_KEY = 'sql_gen_connections';

export const UNIVERSITY_SCHEMA: TableSchema[] = [
  {
    tableName: 'students',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'first_name', type: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'last_name', type: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'email', type: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'age', type: 'INT', isNullable: true, isPrimaryKey: false, isForeignKey: false },
      { name: 'enrollment_date', type: 'DATE', isNullable: true, isPrimaryKey: false, isForeignKey: false }
    ]
  },
  {
    tableName: 'courses',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'course_name', type: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'department', type: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'credits', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: false }
    ]
  },
  {
    tableName: 'enrollments',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'student_id', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: true, foreignKeyRef: { table: 'students', column: 'id' } },
      { name: 'course_id', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: true, foreignKeyRef: { table: 'courses', column: 'id' } },
      { name: 'grade', type: 'DECIMAL(3,2)', isNullable: true, isPrimaryKey: false, isForeignKey: false }
    ]
  }
];

export const ECOMMERCE_SCHEMA: TableSchema[] = [
  {
    tableName: 'users',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'username', type: 'VARCHAR(50)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'email', type: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'role', type: 'VARCHAR(20)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'created_at', type: 'TIMESTAMP', isNullable: false, isPrimaryKey: false, isForeignKey: false }
    ]
  },
  {
    tableName: 'products',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'title', type: 'VARCHAR(100)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'price', type: 'DECIMAL(10,2)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'stock_quantity', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'category', type: 'VARCHAR(50)', isNullable: true, isPrimaryKey: false, isForeignKey: false }
    ]
  },
  {
    tableName: 'orders',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: true, foreignKeyRef: { table: 'users', column: 'id' } },
      { name: 'order_date', type: 'TIMESTAMP', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'total_amount', type: 'DECIMAL(10,2)', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'status', type: 'VARCHAR(20)', isNullable: false, isPrimaryKey: false, isForeignKey: false }
    ]
  },
  {
    tableName: 'order_items',
    columns: [
      { name: 'id', type: 'INT', isNullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'order_id', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: true, foreignKeyRef: { table: 'orders', column: 'id' } },
      { name: 'product_id', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: true, foreignKeyRef: { table: 'products', column: 'id' } },
      { name: 'quantity', type: 'INT', isNullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'unit_price', type: 'DECIMAL(10,2)', isNullable: false, isPrimaryKey: false, isForeignKey: false }
    ]
  }
];

const DEFAULT_CONNECTIONS: DBConnection[] = [
  {
    id: 'university-db',
    name: 'University Database (Postgres)',
    type: 'postgresql',
    host: 'pg-university.neon.tech',
    port: 5432,
    database: 'university_records',
    username: 'edu_admin',
    status: 'connected',
    schema: UNIVERSITY_SCHEMA,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ecommerce-db',
    name: 'E-Commerce Production (MySQL)',
    type: 'mysql',
    host: 'mysql-prod-01.aws.rds',
    port: 3306,
    database: 'store_db',
    username: 'store_db_reader',
    status: 'connected',
    schema: ECOMMERCE_SCHEMA,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const databaseService = {
  getConnections: (): DBConnection[] => {
    const connStr = localStorage.getItem(CONNECTIONS_KEY);
    if (!connStr) {
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(DEFAULT_CONNECTIONS));
      return DEFAULT_CONNECTIONS;
    }
    return JSON.parse(connStr);
  },

  saveConnections: (connections: DBConnection[]) => {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  },

  testConnection: async (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ): Promise<boolean> => {
    if (!apiClient.isMockEnabled()) {
      const result = await apiClient.post<{ success: boolean }>('/databases/test', {
        name,
        type,
        host,
        port,
        database,
        username,
      });
      return result.success !== false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (!host || !database || !username) {
      throw new Error('Host, database name, and username are required.');
    }
    return true;
  },

  createConnection: async (
    name: string,
    type: DBConnection['type'],
    host: string,
    port: number,
    database: string,
    username: string
  ): Promise<DBConnection> => {
    if (!apiClient.isMockEnabled()) {
      const response = await apiClient.post<DBConnection>('/databases', {
        name,
        type,
        host,
        port,
        database,
        username,
      });

      const connections = databaseService.getConnections();
      connections.push(response);
      databaseService.saveConnections(connections);
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const connections = databaseService.getConnections();

    let chosenSchema = UNIVERSITY_SCHEMA;
    if (database.toLowerCase().includes('shop') || database.toLowerCase().includes('store') || database.toLowerCase().includes('commerce')) {
      chosenSchema = ECOMMERCE_SCHEMA;
    } else if (type === 'mysql') {
      chosenSchema = ECOMMERCE_SCHEMA;
    }

    const newConnection: DBConnection = {
      id: crypto.randomUUID(),
      name,
      type,
      host,
      port,
      database,
      username,
      status: 'connected',
      schema: chosenSchema,
      createdAt: new Date().toISOString(),
    };

    connections.push(newConnection);
    databaseService.saveConnections(connections);
    return newConnection;
  },

  deleteConnection: async (id: string): Promise<void> => {
    if (!apiClient.isMockEnabled()) {
      await apiClient.del(`/databases/${id}`);
    }

    await new Promise((resolve) => setTimeout(resolve, apiClient.isMockEnabled() ? 500 : 0));
    const connections = databaseService.getConnections();
    const filtered = connections.filter((c) => c.id !== id);
    databaseService.saveConnections(filtered);
  },
};
