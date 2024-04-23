const Avatar = ({imgUrl, firstName, onClick}) => {
  return (
    <>
    {imgUrl !== undefined && <a target="_blank" href={imgUrl}><img className="rounded-full h-[50px] w-[50px] overflow-hidden" src={imgUrl}></img></a>}
    {imgUrl === undefined && <div onClick={onClick} className='bg-[#6c2dff] h-[50px] w-[50px] text-white text-base px-2 py-2 rounded-full font-light'>{firstName.charAt(0)}</div>}
    </>
  )
}

export default Avatar
