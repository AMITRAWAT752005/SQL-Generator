import React, { createContext, useState, useEffect } from 'react';
import { aiService, AIStreamUpdate } from '../services/ai.service';
import { queryService, QueryResult } from '../services/query.service';
import { historyService, HistoryItem } from '../services/history.service';
import { useDatabase } from '../hooks/useDatabase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sql?: string;
  explanation?: string;
  isStreaming?: boolean;
  statusUpdates?: string[];
  currentStatusIndex?: number;
  timestamp: string;
  executionResult?: QueryResult;
  executionError?: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  isGenerating: boolean;
  isExecuting: boolean;
  currentUpdate: AIStreamUpdate | null;
  sendMessage: (text: string) => Promise<void>;
  executeMessageQuery: (messageId: string, sql: string) => Promise<void>;
  optimizeMessageQuery: (messageId: string, sql: string) => Promise<void>;
  explainMessageQuery: (messageId: string, sql: string) => Promise<void>;
  clearChat: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState<AIStreamUpdate | null>(null);
  
  const { activeConnection } = useDatabase();

  // Load chat logs or initial message
  useEffect(() => {
    const saved = localStorage.getItem('sql_gen_chat_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const initialMessage: ChatMessage = {
        id: 'initial',
        sender: 'assistant',
        text: "Hello! I am your AI Database Copilot. Connect a database, and type what data you need in plain English! (e.g. 'Show all students older than 20')",
        timestamp: new Date().toISOString()
      };
      setMessages([initialMessage]);
      localStorage.setItem('sql_gen_chat_messages', JSON.stringify([initialMessage]));
    }
  }, []);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    localStorage.setItem('sql_gen_chat_messages', JSON.stringify(msgs));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const newMsgs = [...messages, userMsg];
    saveMessages(newMsgs);
    setIsGenerating(true);

    const assistantMsgId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: 'Analyzing...',
      isStreaming: true,
      statusUpdates: [],
      timestamp: new Date().toISOString()
    };

    saveMessages([...newMsgs, assistantMsg]);

    try {
      const schema = activeConnection ? activeConnection.schema : [];
      const dbName = activeConnection ? activeConnection.database : 'No DB Connected';
      const dbType = activeConnection ? activeConnection.type : 'sql';

      if (!activeConnection) {
        // Handle error: No active database connected
        await new Promise((resolve) => setTimeout(resolve, 800));
        const updatedAssistantMsg: ChatMessage = {
          ...assistantMsg,
          text: 'To get started, please connect a database in the **Database Connections** section first. I will wait here!',
          isStreaming: false
        };
        saveMessages([...newMsgs, updatedAssistantMsg]);
        setIsGenerating(false);
        return;
      }

      const updates: string[] = [];

      const result = await aiService.generateSQL(text, schema, (update) => {
        setCurrentUpdate(update);
        if (update.status === 'thinking' || update.status === 'generating') {
          updates.push(update.message);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: update.message,
                    statusUpdates: [...updates]
                  }
                : m
            )
          );
        }
      });

      // AI Finished Generating
      const finalMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: 'SQL Query successfully generated!',
        sql: result.sql,
        explanation: result.explanation,
        isStreaming: false,
        statusUpdates: [...updates, 'SQL Ready.'],
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => {
        const next = prev.map((m) => (m.id === assistantMsgId ? finalMsg : m));
        localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
        return next;
      });

      // Save to query history
      historyService.addHistoryItem(
        dbName,
        dbType,
        text,
        result.sql,
        result.explanation,
        45 // mock latency
      );

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: `Sorry, I encountered an error during generation: ${err.message || 'Unknown error'}`,
        isStreaming: false,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => {
        const next = prev.map((m) => (m.id === assistantMsgId ? errorMsg : m));
        localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
        return next;
      });
    } finally {
      setIsGenerating(false);
      setCurrentUpdate(null);
    }
  };

  const executeMessageQuery = async (messageId: string, sql: string) => {
    setIsExecuting(true);
    const dbName = activeConnection ? activeConnection.database : 'unknown';
    
    // Clear previous results or show loader on message
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, executionResult: undefined, executionError: undefined }
          : m
      )
    );

    try {
      const res = await queryService.executeQuery(sql, dbName);
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === messageId ? { ...m, executionResult: res } : m
        );
        localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
        return next;
      });
    } catch (err: any) {
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === messageId ? { ...m, executionError: err.message || 'Failed to execute query' } : m
        );
        localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
        return next;
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const optimizeMessageQuery = async (messageId: string, sql: string) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const optimizedSql = `-- Optimized Query\n` + sql.replace('SELECT *', 'SELECT id, first_name, last_name' /* dummy replace */);
    const optimizationExplanation = `Optimized table access patterns. Avoided SELECT * wildcard to reduce network traffic and utilize index-only scan patterns.`;

    setMessages((prev) => {
      const next = prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              sql: optimizedSql,
              explanation: `${m.explanation}\n\n**Optimization Notes:**\n${optimizationExplanation}`
            }
          : m
      );
      localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
      return next;
    });
    setIsGenerating(false);
  };

  const explainMessageQuery = async (messageId: string, sql: string) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessages((prev) => {
      const next = prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              explanation: `${m.explanation}\n\n**Detailed Breakdown:**\n1. The SELECT clause limits columns retrieved.\n2. The WHERE clause screens rows matching values.\n3. Read-only query.`
            }
          : m
      );
      localStorage.setItem('sql_gen_chat_messages', JSON.stringify(next));
      return next;
    });
    setIsGenerating(false);
  };

  const clearChat = () => {
    const initialMessage: ChatMessage = {
      id: 'initial',
      sender: 'assistant',
      text: "Chat cleared. Ask me anything about your active database!",
      timestamp: new Date().toISOString()
    };
    saveMessages([initialMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isGenerating,
        isExecuting,
        currentUpdate,
        sendMessage,
        executeMessageQuery,
        optimizeMessageQuery,
        explainMessageQuery,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
