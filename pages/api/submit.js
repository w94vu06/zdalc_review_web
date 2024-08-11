// pages/api/submit.js

import { connectToDatabase } from '../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { articleId, recommended, comment } = req.body;

    try {
      const connection = await connectToDatabase();
      const [result] = await connection.execute(
        'UPDATE post SET recommended = ?, comment = ?, updatedAt = NOW() WHERE id = ?',
        [recommended, comment, articleId]
      );
      await connection.end();

      res.status(200).json({ message: '評論提交成功', result });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: '評論提交失敗' });
    }
  } else {
    res.status(405).json({ message: '僅支援 POST 方法' });
  }
}
