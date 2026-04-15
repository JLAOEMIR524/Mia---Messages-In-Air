export function Preview() {
    const cardFrontData = localStorage.getItem("card");
    console.log("Länge:", cardFrontData?.length);
    console.log("Anfang:", cardFrontData?.substring(0, 50));
    const cardText = localStorage.getItem("currentPostcardText");
    const cardLocation = localStorage.getItem("selectedLocation");

    return (
        <dialog open popover="auto" className="previewContainer">
            <div className="preview">
                <div className="previewTop">
                    <h2>Preview</h2>
                    <img src="./icons/close.svg" alt="" />
                </div>
                    {cardFrontData && <img src={cardFrontData} className="postcardFront" alt="Your Postcard" />}
            </div>
        </dialog>
    )
}