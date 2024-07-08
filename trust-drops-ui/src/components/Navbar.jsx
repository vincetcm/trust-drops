import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Mande from '../assets/mandeLogo.svg';
import Twitter from '../assets/twitter.svg';
import Discord from '../assets/discord.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { pathname } = useLocation();
  const [activeRoute, setActiveRoute] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    setActiveRoute(pathname);
    handleNav();
  }, [pathname]);

  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Home', to: '/' },
    { id: 2, text: 'Airdrop', to: '/airdrop' },
    { id: 3, text: 'Credibility staking', to: '/staking' },
    { id: 4, text: 'Leaderboard', to: '/leaderboard' },
  ];

  return (
    <div className='nav-container font-mono flex flex-1 justify-between bg-black h-[10vh] mx-auto text-white max-w-[90%]'>
      <div className='flex  content-center'>
        <Link
          className='text-3xl font-semibold text-white flex items-center justify-self-start gap-2 tracking-wider'
          to={'/'}
        >
          <img height={150} width={150} src={Mande} alt="Logo"></img>
        </Link>
      </div>
      <div className='flex content-center justify-end w-full'>
        <ul className='navbar-left-container gap-8 md:flex items-center justify-self-end hidden'>
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.to}
              className={`${
                activeRoute === item.to
                  ? 'text-[#7071E8] font-bold'
                  : 'text-white'
              }   text-[18px]`}
            >
              {item.text}
            </Link>
          ))}
          <a href="https://twitter.com/MandeNetwork" target="_blank" rel="noopener noreferrer"><img src={Twitter} width={25} height={25} className='cursor-pointer' alt="Twitter"></img></a>
          <a href="https://discord.gg/9Ugch3fRC2" target="_blank" rel="noopener noreferrer"><img src={Discord} width={25} height={25} className='cursor-pointer' alt="Discord"></img></a>
          <div className='text-[18px]'>
            <ConnectButton showBalance={false}/>
          </div>
          <button onClick={toggleTheme} className="p-2 bg-blue-500 text-white rounded">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </ul>
        {!nav && <div className='content-center block md:hidden text-[12px] pr-2'>
          <ConnectButton accountStatus="address" showBalance={false}/>
        </div>}
        <div onClick={handleNav} className='content-center block md:hidden'>
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>

      <ul
        className={
          nav
            ? 'flex flex-col z-50 fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        <Link
          className='p-4 text-3xl font-semibold text-white flex items-center gap-2 tracking-wider'
          to={'/'}
        >
          <img height={100} width={100} src={Mande} alt="Logo"></img>
        </Link>
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.to}
            className={`${
              activeRoute === item.to
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }  p-4 cursor-pointer text-[18px]`}
          >
            {item.text}
          </Link>
        ))}
        <a href="https://twitter.com/MandeNetwork" target="_blank" rel="noopener noreferrer" className='p-4'><img src={Twitter} width={25} height={25} className='cursor-pointer' alt="Twitter"></img></a>
        <a href="https://discord.gg/9Ugch3fRC2" target="_blank" rel="noopener noreferrer" className='p-4'><img src={Discord} width={25} height={25} className='cursor-pointer' alt="Discord"></img></a>
        <button onClick={toggleTheme} className="p-4 bg-blue-500 text-white rounded">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </ul>
    </div>
  );
}

export default Navbar;
