import React from 'react';
import Link from 'next/link';
import { GiPrayer } from "react-icons/gi";
import { RxDashboard, RxPerson } from 'react-icons/rx';
import { FaListUl } from "react-icons/fa";
import { FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { TbMovie } from "react-icons/tb";

const Sidebar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-20 md:w-20`}>
        <div className='flex flex-col items-center'>
          <Link href='/articles'>
            <div className='bg-amber-500 text-white p-3 rounded-lg inline-block'>
              <GiPrayer size={20} />
            </div>
          </Link>
          <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
          
          <Link href='/articles'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <FaListUl size={20} />
            </div>
          </Link>

          <Link href='/articles'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <TbMovie size={20} />
            </div>
          </Link>

        </div>
      </div>

      {/* Menu Button */}
      <div className='md:hidden fixed bottom-4 left-4 z-50'>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className='bg-amber-500 text-white p-2 rounded-lg'>
          <AiOutlineMenu size={20} />
        </button>
      </div>

      {/* Main Content */}
      <main className='ml-0 md:ml-20 w-full transition-all'>{children}</main>
    </div>
  );
};

function Layout({ children }) {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full'>{children}</main>
    </div>
  );
}

export default Layout;
export { Sidebar };
