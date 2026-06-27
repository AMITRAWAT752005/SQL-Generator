import { apiClient } from './api';

export interface HistoryItem {
  id: string;
  dbName: string;
  dbType: string;
  naturalQuery: string;
  generatedSql: string;
  explanation: string;
  executionTime: number; // in ms
  createdAt: string;
  isSaved: boolean;
}

const HISTORY_KEY = 'sql_gen_history';

const DEFAULT_HISTORY: HistoryItem[] = [
  {
    id: 'h-1',
    dbName: 'university_records',
    dbType: 'postgresql',
    naturalQuery: 'Show all students who are older than 21',
    generatedSql: 'SELECT * FROM students WHERE age > 21;',
    explanation: 'Retrieves all columns from the students table where the age column exceeds 21.',
    executionTime: 45,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isSaved: true,
  },
  {
    id: 'h-2',
    dbName: 'store_db',
    dbType: 'mysql',
    naturalQuery: 'List top 5 products ordered by price descending',
    generatedSql: 'SELECT * FROM products ORDER BY price DESC LIMIT 5;',
    explanation: 'Queries the products table, sorts the results by the price column in descending order, and returns the top 5 records.',
    executionTime: 82,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isSaved: false,
  },
];

export const historyService = {
  getHistory: (): HistoryItem[] => {
    const histStr = localStorage.getItem(HISTORY_KEY);
    if (!histStr) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      return DEFAULT_HISTORY;
    }
    return JSON.parse(histStr);
  },

  saveHistory: (history: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  addHistoryItem: (
    dbName: string,
    dbType: string,
    naturalQuery: string,
    generatedSql: string,
    explanation: string,
    executionTime: number
  ): HistoryItem => {
    const history = historyService.getHistory();
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      dbName,
      dbType,
      naturalQuery,
      generatedSql,
      explanation,
      executionTime,
      createdAt: new Date().toISOString(),
      isSaved: false,
    };

    history.unshift(newItem);
    historyService.saveHistory(history);

    if (!apiClient.isMockEnabled()) {
      apiClient.post('/history', newItem).catch(() => {
        // Persist locally if backend is not available yet
      });
    }

    return newItem;
  },

  toggleSaveItem: (id: string): HistoryItem | null => {
    const history = historyService.getHistory();
    const idx = history.findIndex((h) => h.id === id);
    if (idx === -1) return null;

    history[idx].isSaved = !history[idx].isSaved;
    historyService.saveHistory(history);

    if (!apiClient.isMockEnabled()) {
      apiClient
        .put(`/history/${id}/toggle-save`, { isSaved: history[idx].isSaved })
        .catch(() => {
          // Keep local save state if remote endpoint is not available
        });
    }

    return history[idx];
  },

  deleteItem: (id: string): void => {
    const history = historyService.getHistory();
    const filtered = history.filter((h) => h.id !== id);
    historyService.saveHistory(filtered);

    if (!apiClient.isMockEnabled()) {
      apiClient.del(`/history/${id}`).catch(() => {
        // No-op when remote history is not available
      });
    }
  },

  clearHistory: (): void => {
    historyService.saveHistory([]);

    if (!apiClient.isMockEnabled()) {
      apiClient.del('/history').catch(() => {
        // Ignore clear failures for now
      });
    }
  },
};
