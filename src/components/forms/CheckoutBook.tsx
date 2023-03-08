const CheckoutBook = ({bookCover, title, quantity}) => {
    return (
        <div className="flex
                        justify-center
                        gap-3
                        items-center 
                        p-3
                        text-sm
                        sm:text-md
                        sm:gap-12">
            {/* Cover */}
            <div className="w-1/3 
                            shadow-lg
                            drop-shadow-lg">
                <img src={bookCover} alt="bookcover" />
            </div>
            {/* Title */}
            <div className="font-bold 
                            w-1/3
                            h-6
                            whitespace-normal
                            overflow-hidden
                            text-center
                            sm:h-12">{title}</div>
            {/* Quantity */}
            <div className="flex 
                            flex-col
                            font-bold
                            items-center 
                            w-1/3">
                <div>Q-ty</div>
                <div>{quantity}x</div>
            </div>
        </div>
    )
};

export default CheckoutBook;