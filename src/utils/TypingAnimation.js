import "./TypingAnimation.css";

const TypingAnimation = () => {
  return (
    <div className="flex px-2 py-1 rounded-md justify-center w-[100px] mx-auto mb-3">
      <div className="h-[20px] w-[20px] mr-1 rounded-full bg-[#b7aeaee8]" id="dot1"></div>
      <div className="h-[20px] w-[20px] mr-1 rounded-full bg-[#b7aeaee8]" id="dot2"></div>
      <div className="h-[20px] w-[20px] mr-1 rounded-full bg-[#b7aeaee8]" id="dot3"></div>
    </div>
  )
}

export default TypingAnimation;
