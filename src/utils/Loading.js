import loadingSpinner from '../assets/gifs/loading.gif';

const Loading = ({height}) => {
  return (
    <div className='my-7'>
      <img className={'mx-auto ' + (height ? `h-[${height}]` : 'h-[30px]')} src={loadingSpinner} alt='Loading'></img>
    </div>
  )
}

export default Loading;
