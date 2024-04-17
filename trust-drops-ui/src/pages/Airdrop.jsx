import React from 'react';
import AirdropImg from '../assets/airdropImage.svg';
import AirdropImg2 from '../assets/airdropImage2.svg';

function Airdrop() {
  return (
    <div className=' flex  justify-center  h-[90%]  bg-black   text-white font-mono'>
      <div className='left-contianer w-[60%]  pl-[5%] flex flex-col gap-6  mt-10'>
        <div className='topLeftContainer '>
          <div className='small-text  text-[16px] text-slate-400'>
            YOU'RE ALMOST THERE
          </div>
          <div className='Large-text text-[32px]'>To claim your airdrop:</div>
        </div>
        <div className='bottomContainer bg-airdrop-gradient px-8 py-8 flex flex-col '>
          <div className='flex justify-between  '>
            <div className='flex gap-2 items-center '>
              <div className='sno px-3 py-1 text-[16px]  bg-black rounded-full'>
                1
              </div>
              <div className='text-container'>Connect with twitter/X</div>
            </div>
            <div className='button-container bg-black px-4 py-2 text-center  w-[200px]'>
              Connect twitter
            </div>
          </div>
          <hr className='w-[90%] flex self-center  my-[10px] h-[0.5px] bg-black border-[0px]' />
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center '>
              <div className='sno px-3 py-1 text-[16px]  bg-black rounded-full'>
                2
              </div>
              <div className='text-container'>Connect your wallet</div>
            </div>
            <div className='button-container bg-black px-4 text-center py-2  w-[200px]'>
              Connect wallet
            </div>
          </div>
          <hr className='w-[90%] flex self-center  my-[10px] h-[0.5px] bg-black border-[0px]' />
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center  flex-1   '>
              <div className='sno px-3 py-1 text-[16px]  bg-black rounded-full'>
                3
              </div>
              <div className='text-container'>
                Link your wallet with twitter/X
              </div>
            </div>
            <div className='button-container bg-black px-4 self-center py-2 text-center w-[200px]'>
              Link both
            </div>
          </div>
        </div>
      </div>
      <div className='right-container  w-[40%]  h-full '>
        <img src={AirdropImg} className='object-cover h-full'></img>
      </div>
    </div>
  );
}

export default Airdrop;

{
  /* <div className='flex  justify-center  h-[90%]  bg-red-400   text-white font-mono'>
  <div className='left-contianer w-[50%]  pl-[5%]  '>
    <div className='topLeftContainer '>
      <div className='small-text'>YOU'RE ALMOST THERE</div>
      <div className='Large-text'>To claim your airdrop:</div>
    </div>
    <div className='bottomContainer bg-[#7071E8]'>
      <div className='flex justify-between'>
        <div className='flex gap-2 items-center '>
          <div className='sno px-3 py-1 text-[16px]  bg-black rounded-full'>
            1
          </div>
          <div className='text-container'>Connect with twitter/X</div>
        </div>
        <div className='button-container'>Connect X</div>
      </div>
    </div>
  </div>
  <div className='right-contianer  '>
    <img src={AirdropImg2} className='h-full object-fill '></img>
  </div>
</div>; */
}
