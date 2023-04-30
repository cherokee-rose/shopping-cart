import Page from "components/general/Page";
import CheckoutBook from "./CheckoutBook";
import uniqid from "uniqid";
import { Link } from "react-router-dom";
import { DataContext } from "components/App";
import { useContext, useEffect, useState } from "react";

const CheckoutForm = ({ testUser }: { testUser?: IUser }) => {
  const { user, userCart, setUserCart } = useContext(DataContext);
  const stateUser = testUser !== undefined ? testUser : user;
  const [cartItems, setCartItems] = useState<IBook[]>(
    testUser !== undefined ? (stateUser as IUser).getCart() : userCart
  );

  useEffect(() => {
    if (userCart !== undefined) {
      setCartItems(userCart);
    }
  }, [userCart]);

  return (
    <Page
      content={
        <div
          className="p-6 
                            w-[85%] 
                            h-3/4
                            rounded-xl 
                            bg-base-100 
                            sm:w-1/4"
        >
          {/* Main container */}
          <div
            className="flex
                                flex-col
                                items-center
                                justify-center"
          >
            {/* Items */}
            <div
              className="flex
                         flex-col
                         gap-6
                         scrollbar
                         max-h-[444px]
                         sm:max-h-[540px]
                         overflow-y-scroll"
            >
              {cartItems?.map((book: IBook) => (
                <CheckoutBook
                  key={uniqid()}
                  book={book}
                  quantity={(user as IUser).getQuantity(
                    book.getFormattedTitle()
                  )}
                  updateQuantity={(user as IUser)?.updateQuantity.bind(
                    user,
                    book?.getFormattedTitle()
                  )}
                  updateUserCart={() => setUserCart((user as IUser).getCart())}
                />
              ))}
            </div>
            {/* Checkout button */}
            <Link
              to={cartItems.length > 0 ? "/after-checkout" : "/home"}
              className="btn-primary 
                                                            rounded-full 
                                                            w-1/2 
                                                            self-center 
                                                            mt-12
                                                            text-center"
            >
              Checkout
            </Link>
          </div>
        </div>
      }
      blank={true}
    ></Page>
  );
};

export default CheckoutForm;
