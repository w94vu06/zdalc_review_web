import { connectToDatabase } from '../../db';

export default async function handler(req, res) {
  let connection; // 在這裡初始化 connection 變數

  try {
    // 建立資料庫連接
    connection = await connectToDatabase();

    // 查詢資料庫
    const [rows] = await connection.execute('SELECT * FROM post');
    
    // 返回查詢結果
    res.status(200).json({ articles: rows });
  } catch (error) {
    console.error('Error fetching articles:', error);
    // 如果發生錯誤，返回 500 錯誤和錯誤信息
    res.status(500).json({ error: 'Error fetching articles' });
  } finally {
    if (connection) await connection.end();  // 確保關閉資料庫連接
  }
}
