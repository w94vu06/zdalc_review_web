import { useRouter } from 'next/router';
import { connectToDatabase } from '../../db';
import { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function ArticlePage({ article }) {
  const router = useRouter();
  const contentParagraphs = article.content ? article.content.split('　　') : ['無內容'];

  const [recommended, setRecommended] = useState(article.recommended);  // true: recommended, false: not recommended
  const [comment, setComment] = useState(article.comment || '');

  if (!article) {
    return <p>Loading...</p>; // 在數據還未載入時顯示 Loading...
  }

  const handleRecommendation = (isRecommended) => { // 設置推薦或不推薦
    setRecommended(isRecommended);
  };

  const handleSubmitComment = async () => {
    const payload = {
      articleId: article.id,
      recommended,
      comment,
    };

    console.log('Submitting payload:', payload); // 調試用

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      console.log('Submission result:', result); // 調試用

      router.push('/articles');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{article.title || '無標題'}</h1>
      <div className="text-gray-700 mb-6">
        {contentParagraphs.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      <p className="text-gray-500 italic mb-4">作者: {article.author || '未知'}</p>

      <div className="border-t pt-4 mt-4">
        <h2 className="text-xl font-semibold mb-2">你推薦這篇文章嗎？</h2>
        <button
          onClick={() => handleRecommendation(true)}
          className={`mr-4 px-4 py-2 border border-green-500 rounded-lg ${recommended === true ? 'bg-green-500 text-white' : 'text-green-500'
            }`}
        >
          <FaThumbsUp />
        </button>
        <button
          onClick={() => handleRecommendation(false)}
          className={`px-4 py-2 border border-red-500 rounded-lg ${recommended === false ? 'bg-red-500 text-white' : 'text-red-500'
            }`}
        >
          <FaThumbsDown />
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="在這裡撰寫你的評論..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows="4"
        ></textarea>
        <button
          onClick={handleSubmitComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          提交評論
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  let connection;
  let article = {};

  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM post WHERE id = ?', [id]);

    if (rows.length > 0) {
      article = rows[0];

      // 如果 article 中有 Date 對象，轉換為字符串
      if (article.createdAt) {
        article.createdAt = article.createdAt.toISOString();
      }
      if (article.updatedAt) {
        article.updatedAt = article.updatedAt.toISOString();
      }
    }
  } catch (error) {
    console.error('Error fetching article:', error);
  } finally {
    if (connection) await connection.end();
  }

  if (!article.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
  };
}
