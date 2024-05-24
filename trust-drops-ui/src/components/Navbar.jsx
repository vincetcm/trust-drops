import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Mande from '../assets/mandeLogo.svg';
import Twitter from '../assets/twitter.svg';
import Discord from '../assets/discord.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

function Navbar() {
  const { pathname } = useLocation();
  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    setActiveRoute(pathname);
    handleNav();
  }, [pathname]);

  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home', to: '/' },
    { id: 2, text: 'Airdrop', to: '/airdrop' },
    { id: 3, text: 'Credibility staking', to: '/staking' },
    { id: 4, text: 'Leaderboard', to: '/leaderboard' },
  ];

  return (
    <div className='nav-container font-mono flex flex-1 justify-between bg-black h-[10vh] mx-auto text-white max-w-[90%]'>
      {/* Logo */}
      <div className='flex  content-center'>
        <Link
          className='text-3xl font-semibold text-white flex items-center justify-self-start gap-2 tracking-wider'
          to={'/'}
        >
          <img src={Mande}></img> MANDE
        </Link>
      </div>
      <div className='flex content-center justify-end w-full'>
        {/* Desktop Navigation */}
        <ul className='navbar-left-container gap-8 md:flex items-center justify-self-end hidden'>
          {navItems.map(item => (
            <Link
              to={item.to}
              className={`${
                activeRoute == item.to
                  ? 'text-[#7071E8] font-bold'
                  : 'text-white'
              }   text-[18px]`}
            >
              {item.text}
            </Link>
          ))}
          <a href="https://twitter.com/MandeNetwork" target="_blank"><img src={Twitter} width={25} height={25} className='cursor-pointer'></img></a>
          <a href="https://discord.gg/9Ugch3fRC2" target="_blank"><img src={Discord} width={25} height={25} className='cursor-pointer'></img></a>
          <div className='text-[18px]'>
            <ConnectButton showBalance={false}/>
          </div>
        </ul>

        {/* Mobile Connect wallet and Navigation Icon */}
        <div onClick={handleNav} className='content-center block md:hidden'>
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'flex flex-col z-50 fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <Link
          className='p-4 text-3xl font-semibold text-white flex items-center gap-2 tracking-wider'
          to={'/'}
        >
          <img src={Mande}></img> MANDE
        </Link>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <Link
            to={item.to}
            className={`${
              activeRoute == item.to
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }  p-4 cursor-pointer text-[18px]`}
            >
            {item.text}
          </Link>
        ))}
        <a href="https://twitter.com/MandeNetwork" target="_blank" className='p-4'><img src={Twitter} width={25} height={25} className='cursor-pointer'></img></a>
        <a href="https://discord.gg/9Ugch3fRC2" target="_blank" className='p-4'><img src={Discord} width={25} height={25} className='cursor-pointer'></img></a>
        <div className='block md:hidden text-[18px]'>
          <ConnectButton showBalance={false}/>
        </div>
      </ul>
    </div>
  );
}

export default Navbar;
