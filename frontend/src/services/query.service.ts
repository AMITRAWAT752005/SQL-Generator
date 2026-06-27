import { apiClient } from './api';

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime: number; // in ms
  database: string;
}

const MOCK_STUDENTS = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@edu.org', age: 21, enrollment_date: '2024-09-01' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@edu.org', age: 22, enrollment_date: '2024-09-01' },
  { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.j@edu.org', age: 20, enrollment_date: '2025-01-15' },
  { id: 4, first_name: 'Alice', last_name: 'Williams', email: 'alice.w@edu.org', age: 23, enrollment_date: '2023-09-01' },
  { id: 5, first_name: 'Charlie', last_name: 'Brown', email: 'charlie.brown@edu.org', age: 19, enrollment_date: '2025-09-01' }
];

const MOCK_COURSES = [
  { id: 101, course_name: 'Introduction to Computer Science', department: 'Computer Science', credits: 4 },
  { id: 102, course_name: 'Database Management Systems', department: 'Computer Science', credits: 4 },
  { id: 103, course_name: 'Linear Algebra', department: 'Mathematics', credits: 3 },
  { id: 104, course_name: 'Artificial Intelligence', department: 'Computer Science', credits: 4 }
];

const MOCK_ENROLLMENTS = [
  { id: 1001, student_id: 1, course_id: 101, grade: 3.8 },
  { id: 1002, student_id: 1, course_id: 102, grade: 4.0 },
  { id: 1003, student_id: 2, course_id: 102, grade: 3.5 },
  { id: 1004, student_id: 3, course_id: 103, grade: 3.0 },
  { id: 1005, student_id: 4, course_id: 104, grade: 3.9 }
];

const MOCK_USERS = [
  { id: 1, username: 'cyber_knight', email: 'knight@gmail.com', role: 'customer', created_at: '2025-10-12 14:22:10' },
  { id: 2, username: 'dev_guy', email: 'devguy@outlook.com', role: 'customer', created_at: '2025-11-01 09:15:30' },
  { id: 3, username: 'admin_sophia', email: 'sophia.admin@store.com', role: 'admin', created_at: '2025-01-01 00:00:00' },
  { id: 4, username: 'shopper_99', email: 'buyer99@yahoo.com', role: 'customer', created_at: '2026-03-15 18:40:00' }
];

const MOCK_PRODUCTS = [
  { id: 1, title: 'iPhone 15 Pro Max', price: 1199.99, stock_quantity: 45, category: 'Electronics' },
  { id: 2, title: 'Sony WH-1000XM5 ANC Headphones', price: 349.99, stock_quantity: 120, category: 'Electronics' },
  { id: 3, title: 'Ergonomic Mesh Office Chair', price: 249.50, stock_quantity: 30, category: 'Furniture' },
  { id: 4, title: 'Leather Bound Bullet Journal', price: 18.99, stock_quantity: 250, category: 'Stationery' },
  { id: 5, title: 'Stainless Steel Water Bottle 32oz', price: 25.00, stock_quantity: 500, category: 'Accessories' }
];

const MOCK_ORDERS = [
  { id: 5001, user_id: 1, order_date: '2026-05-10 11:30:00', total_amount: 1199.99, status: 'Shipped' },
  { id: 5002, user_id: 2, order_date: '2026-05-12 15:45:00', total_amount: 368.98, status: 'Processing' },
  { id: 5003, user_id: 4, order_date: '2026-06-01 10:00:00', total_amount: 25.00, status: 'Delivered' }
];

const MOCK_ORDER_ITEMS = [
  { id: 9001, order_id: 5001, product_id: 1, quantity: 1, unit_price: 1199.99 },
  { id: 9002, order_id: 5002, product_id: 2, quantity: 1, unit_price: 349.99 },
  { id: 9003, order_id: 5002, product_id: 4, quantity: 1, unit_price: 18.99 },
  { id: 9004, order_id: 5003, product_id: 5, quantity: 1, unit_price: 25.00 }
];

export const queryService = {
  executeQuery: async (sql: string, dbName: string): Promise<QueryResult> => {
    if (!apiClient.isMockEnabled()) {
      return apiClient.post<QueryResult>('/query/execute', {
        sql,
        database: dbName,
      });
    }

    const latency = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, latency));

    const cleanSql = sql.trim().toLowerCase();
    const forbidden = ['drop', 'truncate', 'alter', 'delete', 'insert', 'update', 'create'];
    for (const op of forbidden) {
      const regex = new RegExp(`\\b${op}\\b`, 'i');
      if (regex.test(cleanSql)) {
        throw new Error(`Permission Denied: Write/Modify operation '${op.toUpperCase()}' is restricted on this connection.`);
      }
    }

    if (!cleanSql.startsWith('select')) {
      throw new Error("Syntax Error: Only 'SELECT' queries are supported on this read-only dashboard.");
    }

    let rawRows: Record<string, any>[] = [];
    if (cleanSql.includes('students')) {
      rawRows = MOCK_STUDENTS;
    } else if (cleanSql.includes('courses')) {
      rawRows = MOCK_COURSES;
    } else if (cleanSql.includes('enrollments')) {
      rawRows = MOCK_ENROLLMENTS;
    } else if (cleanSql.includes('users')) {
      rawRows = MOCK_USERS;
    } else if (cleanSql.includes('products')) {
      rawRows = MOCK_PRODUCTS;
    } else if (cleanSql.includes('orders') && !cleanSql.includes('order_items')) {
      rawRows = MOCK_ORDERS;
    } else if (cleanSql.includes('order_items')) {
      rawRows = MOCK_ORDER_ITEMS;
    } else {
      rawRows = [
        { id: 1, msg: 'Query executed successfully, but target table was not recognized.', sql_ran: sql },
      ];
    }

    let filteredRows = [...rawRows];
    const limitMatch = cleanSql.match(/limit\s+(\d+)/);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      filteredRows = filteredRows.slice(0, limit);
    }

    if (cleanSql.includes('age >')) {
      const ageMatch = cleanSql.match(/age\s*>\s*(\d+)/);
      if (ageMatch) {
        const val = parseInt(ageMatch[1], 10);
        filteredRows = filteredRows.filter((r) => r.age > val);
      }
    }
    if (cleanSql.includes('price >')) {
      const priceMatch = cleanSql.match(/price\s*>\s*(\d+)/);
      if (priceMatch) {
        const val = parseFloat(priceMatch[1]);
        filteredRows = filteredRows.filter((r) => r.price > val);
      }
    }

    if (cleanSql.includes('count(*)') || cleanSql.includes('count(1)')) {
      filteredRows = [{ 'COUNT(*)': filteredRows.length }];
    }

    const columns = filteredRows.length > 0 ? Object.keys(filteredRows[0]) : [];
    return {
      columns,
      rows: filteredRows,
      rowCount: filteredRows.length,
      executionTime: latency,
      database: dbName,
    };
  },
};
