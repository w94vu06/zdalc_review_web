import React from 'react';
import { GoQuestion } from "react-icons/go";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const articles = () => {

  const [articles, setArticles] = useState([]); // 用來記錄文章列表
  const [filter, setFilter] = useState(''); // 用來記錄篩選條件

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
    fetchArticles();
  }, []);

  // 根據篩選條件過濾文章
  const filteredArticles = articles.filter(article => {
    if (filter === 'recommended') {
      return article.recommended === 1;
    } else if (filter === 'notRecommended') {
      return article.recommended === 0;
    } else if (filter === 'notReviewed') {
      return article.recommended === null || article.recommended === undefined;
    }
    return true; // 'all' 篩選器或其他情況下顯示所有文章
  });

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4'>
        <h2>文章列表</h2>
      </div>

      {/* 篩選器 */}
      <div className="flex justify-start p-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 mx-2 border rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('recommended')}
          className={`px-4 py-2 mx-2 border rounded-lg ${filter === 'recommended' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          推薦
        </button>
        <button
          onClick={() => setFilter('notRecommended')}
          className={`px-4 py-2 mx-2 border rounded-lg ${filter === 'notRecommended' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          不推薦
        </button>
        <button
          onClick={() => setFilter('notReviewed')}
          className={`px-4 py-2 mx-2 border rounded-lg ${filter === 'notReviewed' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          未評論
        </button>
      </div>

      <div className='p-4'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
          <div className='my-3 p-2 grid md:grid-cols-5 sm:grid-cols-2 grid-cols-2 items-center justify-between cursor-pointer'>
            <span className='flex md:col-span-2 sm:col-span-2'>文章標題</span>
            <span className='sm:text-left text-right'>分類</span>
            <span className='hidden md:grid'>最近檢視時間</span>
            <span className='hidden sm:grid'>評論</span>
          </div>
          <ul>
            {filteredArticles.map((article) => (
              <Link href={`/article/${article.id}`} key={article.id}>
                <li
                  className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 items-center justify-between cursor-pointer'
                >
                  <div className='flex md:col-span-2 sm:col-span-2 col-span-2 items-center'>
                    <div className='bg-gray-100 p-3 rounded-lg'>
                      {article.recommended === 1 ? (
                        <FaThumbsUp className='text-green-500' />
                      ) : article.recommended === 0 ? (
                        <FaThumbsDown className='text-red-500' />
                      ) : (
                        <GoQuestion className='text-gray-500' />
                      )}
                    </div>
                    <div className='pl-4'>
                      <p className='text-gray-800 font-bold'>{article.title}</p>
                      <p className='text-gray-800 text-sm'>{article.author}</p>
                    </div>
                  </div>
                  <p className='text-gray-600 sm:text-left text-right'>
                    <span
                      className={
                        article.category === '科學中道'
                          ? 'bg-green-200 p-2 rounded-lg'
                          : article.category === '哲理中道'
                            ? 'bg-blue-200 p-2 rounded-lg'
                            : 'bg-gray-200 p-2 rounded-lg'
                      }
                    >
                      {article.category}
                    </span>
                  </p>
                  <p className='hidden md:flex'>
                    {new Date(article.updatedAt).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    }).replace(',', '')}
                  </p>
                  <div className='sm:flex hidden justify-between items-center'>
                    <p>{article.comment}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default articles;
