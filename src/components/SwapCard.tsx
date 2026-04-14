const SwapCard = ({ 
  sticker = "🍍", 
  description = "Star", 
  xpAmount = 800, 
  iconSrc = "./icons/Check.svg", 
  altText = "Plux",
  extraClass = "",
  extraClass2 = ""
}) => {
  return (
    <div className="swap">
        <div className={`stickerCard ${extraClass2}`}>
        <p className="sticker">{sticker}</p>
        <p className="description">{description}</p>
      </div>

      <div className={`xpCard ${extraClass}`}>
        <img src={iconSrc} alt={altText} />
        <p>{xpAmount} XP</p>
      </div>
    </div>
  );
};

export default SwapCard;