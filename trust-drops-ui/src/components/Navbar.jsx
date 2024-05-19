import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Mande from '../assets/mandeLogo.svg';
import Twitter from '../assets/twitter.svg';
import Discord from '../assets/discord.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
  const { pathname } = useLocation();
  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    if (pathname == '/') {
      setActiveRoute('home');
    } else if (pathname == '/staking') {
      setActiveRoute('staking');
    } else if (pathname == '/leaderboard') {
      setActiveRoute('leaderboard');
    } else if (pathname == '/airdrop') {
      setActiveRoute('airdrop');
    }
  }, [pathname]);
  return (
    <div className='nav-container font-mono flex  justify-center  bg-black h-[10vh] '>
      <div className='flex-1 flex justify-between items-center max-w-[90%] '>
        <Link
          className='text-3xl font-semibold text-white flex items-center gap-2 tracking-wider'
          to={'/'}
        >
          <img src={Mande}></img> MANDE
        </Link>
        <div className='navbar-left-container gap-8 flex items-center'>
          <Link
            to={'/'}
            className={`${
              activeRoute == 'home' ? 'text-[#7071E8] font-bold' : 'text-white'
            }   text-[18px]`}
          >
            Home
          </Link>
          <Link
            to={'/airdrop'}
            className={`${
              activeRoute == 'airdrop'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
          >
            Airdrop
          </Link>
          <Link
            to={'/staking'}
            className={`${
              activeRoute == 'staking'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
          >
            Credibility staking
          </Link>
          <Link
            to={'/leaderboard'}
            className={`${
              activeRoute == 'leaderboard'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
          >
            Leaderboard
          </Link>
          <a href="https://twitter.com/MandeNetwork" target="_blank"><img src={Twitter} width={25} height={25} className='cursor-pointer'></img></a>
          <a href="https://discord.gg/9Ugch3fRC2" target="_blank"><img src={Discord} width={25} height={25} className='cursor-pointer'></img></a>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 12,
              fontSize: 18
            }}
          >
            <ConnectButton showBalance={false}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
