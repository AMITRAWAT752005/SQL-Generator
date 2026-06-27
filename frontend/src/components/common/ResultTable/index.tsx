import React from 'react';
import { QueryResult } from '../../../services/query.service';

interface ResultTableProps {
  result: QueryResult;
}

export const ResultTable: React.FC<ResultTableProps> = ({ result }) => {
  if (!result.rows.length) {
    return <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No rows returned.</div>;
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
        <thead>
          <tr>
            {result.columns.map((column) => (
              <th
                key={column}
                style={{ textAlign: 'left', padding: '12px 14px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ background: rowIndex % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
              {result.columns.map((column) => (
                <td key={column} style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {String(row[column] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
