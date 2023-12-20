import React, { useState } from 'react'
import { postImage } from './postType'
import Modal from './modal';
import Media from './media';

export default function Image(props: postImage){
  const [mediaIdx, setMediaIdx] = useState(0);
  const media = props.mediaList[mediaIdx];

  return (
    <div className='relative bg-black pb-[75%]'>
      <Media type={media.type} data={media.data} controls={true}/>
        {mediaIdx > 0 &&  <button data-testid="minus"  className='absolute top-1/2 left-[5%] text-sm text-white cursor-pointer bg-[#1a1a1acc]  rounded-full px-2 py-0.5 font-bold' 
        onClick={() => {setMediaIdx(mediaIdx - 1)}}>&#10094;</button>}
        {mediaIdx < props.mediaList.length - 1 && <button data-testid="plus" className='absolute top-1/2 right-[5%] text-sm text-white text-white cursor-pointer bg-[#1a1a1acc]  rounded-full px-2 py-0.5 font-bold'
        onClick={() => {setMediaIdx(mediaIdx + 1)}}>&#10095;</button>}
    </div>
  )
}
