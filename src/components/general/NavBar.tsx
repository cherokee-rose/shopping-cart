import IconButton from "components/general/IconButton";
import TextButton from "components/general/TextButton";
import uniqid from "uniqid";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "src/components/App";
import BookTrie from "classes/BookTrie";

const NavBar = ({
  testUser,
  toggleOffcanvas,
}: {
  testUser?: IUser;
  toggleOffcanvas: () => void;
}) => {
  const textBtnClasses = "bg-transparent " + "hover:bg-primary-focus";

  const navigate = useNavigate();
  const { user, books } = useContext(DataContext);
  const [stateUser, setUser] = useState<IUser>(
    testUser ? testUser : (user as IUser)
  );
  const [offCanvasToggleIcon, setOffCanvasToggleIcon] = useState("bars");
  const [navbarToolsIcon, setNavbarToolsIcon] = useState("ellipsis");
  const [loginButtonIcon, setLoginButtonIcon] = useState(
    stateUser?.getName() === "Guest User" ? "sign-in" : "sign-out"
  );
  const [bookSearchTrie, setBookSearchTrie] = useState<BookTrie>(null);
  const [searchResult, setSearchResult] = useState<IBook[]>([]);

  // Load the user data
  useEffect(() => {
    // test if the user object is defined
    if (user && Object.keys(user).length > 0) {
      setUser(user as IUser);
    } else if (testUser) {
      setUser(testUser);
    }
  }, [user, testUser]);

  // Load the book data
  useEffect(() => {
    if (books && books.length > 0) {
      setBookSearchTrie(new BookTrie(books));
    }
  }, [books]);

  // Update the login button icon
  useEffect(() => {
    if (stateUser?.getName() === "Guest User") {
      setLoginButtonIcon("sign-in");
    } else {
      setLoginButtonIcon("sign-out");
    }
  }, [stateUser]);

  const toggleLoginButton = () => {
    if (stateUser?.getName() === "Guest User") {
      navigate("/sign-in");
    } else {
      navigate("/sign-out");
    }
  };

  const toggleOffcanvasAndIcon = () => {
    toggleOffcanvas();
    setOffCanvasToggleIcon(offCanvasToggleIcon === "bars" ? "xmark" : "bars");
  };

  const searchBook = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const result = bookSearchTrie.search(searchTerm);
      setSearchResult([...result.values()]);
    }
  };

  return (
    <div
      className="navbar  
                 h-12
                 w-[360px]
                 fixed 
                 bg-primary 
                 text-base-100 
                 rounded-xl 
                 shadow-lg
                 z-50
                 sm:w-[99%]
                 mt-2"
    >
      {/* Navbar start */}
      <div
        className="navbar-start 
                   w-1/6 
                   sm:w-1/4"
      >
        {/* Hamburger */}
        <IconButton
          onClickListener={toggleOffcanvasAndIcon}
          classes={""}
          iconName={offCanvasToggleIcon}
        ></IconButton>

        {/* Title */}
        <Link
          to={"/home"}
          className="ml-2 
                                hidden 
                                text-shadow-lg 
                                shadow-gray-600
                                sm:block 
                                sm:text-2xl"
        >
          Bookstore.
        </Link>
      </div>
      {/* Navbar center */}
      <div
        className="navbar-center 
                            w-2/3 
                            sm:w-1/2"
      >
        {/* Search input */}
        <div
          className="form-control 
                                w-full 
                                mr-2 
                                peer/search"
        >
          <input
            onChange={(e) => searchBook(e.target.value)}
            type="text"
            className="dropdown-toggle 
                                                                                                  input 
                                                                                                  rounded-none 
                                                                                                  border-0 
                                                                                                  border-b-2 
                                                                                                  border-b-base-100 
                                                                                                  bg-transparent 
                                                                                                  focus:outline-none"
          />
        </div>
        {/* Search icon */}
        <div
          className="hidden 
                                sm:block"
          data-testid="search-button"
        >
          <IconButton
            onClickListener={() => null}
            classes={""}
            iconName={"search"}
          ></IconButton>
        </div>
        {/* Search results */}
        {searchResult.length > 0 && (
          <div
            className="absolute 
                       dropdown 
                       dropdown-open 
                       mt-16
                       w-1/2 
                       sm:mt-12 
                       sm:w-1/3"
          >
            <ul
              tabIndex={0}
              className="dropdown-content 
                                                      menu 
                                                      p-2 
                                                      bg-primary 
                                                      w-full 
                                                      rounded-xl 
                                                      shadow-md"
            >
              {searchResult.map((book) => (
                <Link
                  to={`/categories/${book.getFormattedCategoryName()}/${book.getFormattedTitle()}`}
                  key={uniqid()}
                >
                  <li className="menu-item">{book.getTitle()}</li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Navbar end */}
      <div
        className={`navbar-end 
                             flex 
                             flex-col 
                             bg-primary 
                             gap-3 
                             w-1/6 
                             transition-all 
                             duration-300 
                             ease-in 
                             rounded-xl 
                             z-50
                             sm:w-1/4 
                             sm:bg-inherit 
                             sm:flex-row 
                             ${
                               navbarToolsIcon === "xmark"
                                 ? "mt-5 " +
                                   "translate-y-28 " +
                                   "p-2 " +
                                   "shadow-md"
                                 : ""
                             }`}
      >
        {/* Tools-collapse toggle which is displayed for smaller screens */}
        {window.screen.width < 640 && (
          <div
            data-testid="tools-toggle"
            onClick={() =>
              setNavbarToolsIcon(
                navbarToolsIcon === "xmark" ? "ellipsis" : "xmark"
              )
            }
          >
            <IconButton
              onClickListener={() => null}
              classes={""}
              iconName={navbarToolsIcon}
            ></IconButton>
          </div>
        )}
        {/* Tools elememts*/}
        {(window.screen.width > 640 || navbarToolsIcon === "xmark") && (
          <>
            {/* Wishlist dropdown */}
            <div
              className="dropdown 
                                        dropdown-left 
                                        sm:dropdown-bottom"
            >
              {/* Wishlist toggle */}
              <label data-testid={"wishlist-toggle"} tabIndex={0}>
                {window.screen.width > 640 ? (
                  <TextButton
                    onClickListener={() => null}
                    classes={textBtnClasses}
                    textContent={"Wishlist"}
                  ></TextButton>
                ) : (
                  <IconButton
                    onClickListener={() => null}
                    classes={""}
                    iconName={"heart"}
                  ></IconButton>
                )}
              </label>
              {/* Wishlist dropdown */}
              <ul
                data-testid={"wishlist-dropdown"}
                tabIndex={0}
                className="dropdown-content
                                                                                          menu
                                                                                          p-2 
                                                                                          shadow 
                                                                                          bg-primary
                                                                                          rounded-box
                                                                                          w-52"
              >
                {stateUser?.getWishlist().map((item) => (
                  <Link
                    key={uniqid()}
                    to={`/categories/${item.getFormattedCategoryName()}/${item.getFormattedTitle()}`}
                  >
                    {item.getTitle()}
                    <IconButton
                      iconName={"close"}
                      classes={"ml-16"}
                      onClickListener={(user as IUser).removeFromWishlist.bind(
                        user,
                        item.getFormattedTitle()
                      )}
                    />
                  </Link>
                ))}
              </ul>
            </div>
            {/* Cart dropdown */}
            <div
              className="dropdown 
                                        dropdown-left 
                                        sm:dropdown-bottom"
            >
              {/* Cart toggle */}
              <label data-testid={"cart-toggle"} tabIndex={0}>
                {window.screen.width > 640 ? (
                  <TextButton
                    onClickListener={() => null}
                    classes={textBtnClasses}
                    textContent={"Cart"}
                  ></TextButton>
                ) : (
                  <IconButton
                    onClickListener={() => null}
                    classes={""}
                    iconName={"cart"}
                  ></IconButton>
                )}
              </label>
              {/* Cart dropdown content */}
              <ul
                data-testid={"cart-dropdown"}
                tabIndex={0}
                className="dropdown-content
                                                                                      menu
                                                                                      p-2
                                                                                      shadow
                                                                                      bg-primary
                                                                                      rounded-box
                                                                                      w-52"
              >
                {stateUser?.getCart().map((item) => (
                  <Link
                    key={uniqid()}
                    to={`/categories/${item.getFormattedCategoryName()}/${item.getFormattedTitle()}`}
                  >
                    {item.getTitle()}
                    <IconButton
                      iconName={"close"}
                      classes={"ml-16"}
                      onClickListener={(user as IUser).removeFromCart.bind(
                        user,
                        item.getFormattedTitle()
                      )}
                    />
                  </Link>
                ))}
              </ul>
            </div>
            {/* User information dropdown */}
            <div
              className="dropdown 
                                        dropdown-left 
                                        sm:dropdown-bottom"
            >
              {/* User information toggle */}
              <label data-testid={"user-toggle"} tabIndex={0}>
                <IconButton
                  onClickListener={() => null}
                  classes={""}
                  iconName={"user"}
                ></IconButton>
              </label>
              {/* User information dropdown content */}
              <div
                tabIndex={0}
                className="dropdown-content 
                                                         p-2 
                                                         shadow 
                                                         bg-primary 
                                                         rounded-box 
                                                         w-52"
              >
                {stateUser?.getName()}
              </div>
            </div>
            {/* Sign-in/sign-out button */}
            <div data-testid="sign-toggle">
              <IconButton
                onClickListener={toggleLoginButton}
                classes={""}
                iconName={loginButtonIcon}
              ></IconButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
