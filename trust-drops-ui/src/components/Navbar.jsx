import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Mande from '../assets/mandeLogo.svg';
import Twitter from '../assets/twitter.svg';
import Discord from '../assets/discord.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { ThemeContext } from '../contexts/ThemeContext';

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

  const { theme, toggleTheme } = useContext(ThemeContext);

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
          <img height={150} width={150} src={Mande}></img>
        </Link>
      </div>
      <div className='flex content-center justify-end w-full'>
        {/* Desktop Navigation */}
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
          <a href="https://twitter.com/MandeNetwork" target="_blank" rel="noopener noreferrer">
            <img src={Twitter} width={25} height={25} className='cursor-pointer' alt="Twitter"/>
          </a>
          <a href="https://discord.gg/9Ugch3fRC2" target="_blank" rel="noopener noreferrer">
            <img src={Discord} width={25} height={25} className='cursor-pointer'
