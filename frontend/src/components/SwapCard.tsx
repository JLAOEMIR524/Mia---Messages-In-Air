const SwapCard = ({
  stickerSrc = "./icons/heart.avif",
  description = "Star",
  xpAmount = 800,
  iconSrc = "./icons/Check.svg",
  extraClass = "",
  extraClass2 = "",
}) => {
  return (
    <div className="swap">
      <div className={`stickerCard ${extraClass2}`}>
        <div className="sticker-container">
          <img src={stickerSrc} alt={description} className="sticker-img" />
        </div>
        <p className="description">{description}</p>
      </div>

      <div className={`xpCard ${extraClass}`}>
        <img src={iconSrc} alt="Sticker" aria-hidden="true" />
        <p>{xpAmount} XP</p>
      </div>
    </div>
  );
};

export default SwapCard;
