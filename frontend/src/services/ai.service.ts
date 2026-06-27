import { TableSchema } from './database.service';

export interface AIStreamUpdate {
  status: 'thinking' | 'generating' | 'completed' | 'error';
  message: string;
  sql?: string;
  explanation?: string;
}

export const aiService = {
  generateSQL: async (
    prompt: string,
    schema: TableSchema[],
    onUpdate: (update: AIStreamUpdate) => void
  ): Promise<{ sql: string; explanation: string }> => {
    
    // 1. Thinking steps
    onUpdate({ status: 'thinking', message: 'Understanding your request...' });
    await new Promise((resolve) => setTimeout(resolve, 800));

    onUpdate({ status: 'thinking', message: 'Checking connected database...' });
    await new Promise((resolve) => setTimeout(resolve, 600));

    onUpdate({ status: 'thinking', message: 'Reading table schemas...' });
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Determine mock SQL and explanation based on input keywords
    const lowerPrompt = prompt.toLowerCase();
    let generatedSql = '';
    let explanation = '';

    // University DB rules
    if (lowerPrompt.includes('student') || lowerPrompt.includes('grade') || lowerPrompt.includes('enroll')) {
      if (lowerPrompt.includes('older than') || lowerPrompt.includes('age >') || lowerPrompt.includes('age greater')) {
        const ageMatch = lowerPrompt.match(/(?:older than|age >|age greater than)\s*(\d+)/);
        const age = ageMatch ? ageMatch[1] : '20';
        generatedSql = `SELECT * \nFROM students \nWHERE age > ${age};`;
        explanation = `This query selects all attributes of students whose age is strictly greater than ${age}.`;
      } else if (lowerPrompt.includes('grade') || lowerPrompt.includes('mark') || lowerPrompt.includes('score')) {
        generatedSql = `SELECT s.first_name, s.last_name, c.course_name, e.grade\nFROM students s\nJOIN enrollments e ON s.id = e.student_id\nJOIN courses c ON e.course_id = c.id\nORDER BY e.grade DESC;`;
        explanation = `This query joins the students, enrollments, and courses tables to retrieve a list of student names, the courses they are enrolled in, and their respective grades, sorted by grades in descending order.`;
      } else if (lowerPrompt.includes('count') || lowerPrompt.includes('how many')) {
        generatedSql = `SELECT COUNT(*) as total_students \nFROM students;`;
        explanation = `This query uses the COUNT aggregate function to calculate the total number of records in the students table.`;
      } else {
        generatedSql = `SELECT * \nFROM students \nLIMIT 100;`;
        explanation = `This query retrieves the first 100 student records from the students table.`;
      }
    }
    // ECommerce DB rules
    else if (lowerPrompt.includes('product') || lowerPrompt.includes('price') || lowerPrompt.includes('stock') || lowerPrompt.includes('order') || lowerPrompt.includes('user')) {
      if (lowerPrompt.includes('expensive') || lowerPrompt.includes('top price') || lowerPrompt.includes('order by price')) {
        generatedSql = `SELECT * \nFROM products \nORDER BY price DESC \nLIMIT 5;`;
        explanation = `This query selects all columns from the products table, sorts them by price in descending order, and limits the output to the top 5 most expensive products.`;
      } else if (lowerPrompt.includes('stock') || lowerPrompt.includes('low stock') || lowerPrompt.includes('quantity')) {
        generatedSql = `SELECT title, stock_quantity, price \nFROM products \nWHERE stock_quantity < 50 \nORDER BY stock_quantity ASC;`;
        explanation = `This query retrieves the titles, available stocks, and prices of products whose stock count is lower than 50, sorted in ascending order of stock availability.`;
      } else if (lowerPrompt.includes('order') && lowerPrompt.includes('user')) {
        generatedSql = `SELECT o.id as order_id, u.username, o.total_amount, o.status, o.order_date\nFROM orders o\nJOIN users u ON o.user_id = u.id\nORDER BY o.order_date DESC;`;
        explanation = `This query joins the orders and users tables to fetch order listings showing order IDs, usernames, checkout amounts, statuses, and transaction timestamps, sorted from the most recent order.`;
      } else if (lowerPrompt.includes('revenue') || lowerPrompt.includes('total sales') || lowerPrompt.includes('sum')) {
        generatedSql = `SELECT SUM(total_amount) as total_revenue \nFROM orders \nWHERE status = 'Delivered';`;
        explanation = `This query calculates the sum total of checkout amounts from the orders table where the delivery status is marked as 'Delivered', representing realized revenue.`;
      } else if (lowerPrompt.includes('user')) {
        generatedSql = `SELECT id, username, email, role \nFROM users;`;
        explanation = `This query lists the details (ID, username, email, and security role) of all registered users in the database.`;
      } else {
        generatedSql = `SELECT * \nFROM products \nLIMIT 50;`;
        explanation = `This query fetches up to 50 product records from the catalog.`;
      }
    }
    // Generic fallback
    else {
      if (schema.length > 0) {
        const firstTable = schema[0];
        const primaryCols = firstTable.columns.map((c) => c.name).slice(0, 3).join(', ');
        generatedSql = `SELECT ${primaryCols} \nFROM ${firstTable.tableName} \nLIMIT 10;`;
        explanation = `This query fetches the top 10 rows from the primary table '${firstTable.tableName}', selecting the columns: ${primaryCols}.`;
      } else {
        generatedSql = `SELECT 1;`;
        explanation = `A dummy fallback query since no active database schema tables are detected.`;
      }
    }

    onUpdate({ status: 'generating', message: 'Generating SQL...' });
    await new Promise((resolve) => setTimeout(resolve, 600));

    onUpdate({ status: 'generating', message: 'Validating SQL query syntax...' });
    await new Promise((resolve) => setTimeout(resolve, 600));

    onUpdate({ status: 'completed', message: 'SQL Ready.', sql: generatedSql, explanation: explanation });

    return { sql: generatedSql, explanation };
  }
};
