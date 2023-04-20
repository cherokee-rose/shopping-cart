import { createContext, useEffect, useState } from "react";
import { guestUser } from "utils/constants";
import DataObject from "utils/DataObject";
import RouteSwitch from "./RouteSwitch";

import "styles/App.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "tw-elements";

// Data
const DataContext = createContext(
  {} as {
    user: IUser | {};
    categories: ICategory[] | [];
    categoryMap: CategoryMap | {};
    books: IBook[] | [];
    bookMap: BookMap | {};
    signUp: SignUp | {};
    signIn: SignIn | {};
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
  }
);

function App() {
  const [user, setUser] = useState(guestUser);
  const [data, setData] = useState({} as DataObject | {});
  const [categories, setCategories] = useState([] as ICategory[] | []);
  const [categoryMap, setCategoryMap] = useState({} as CategoryMap | {});
  const [books, setBooks] = useState([] as IBook[] | []);
  const [bookMap, setBookMap] = useState({} as BookMap | {});
  const [signUp, setSignUp] = useState({} as SignUp | {});
  const [signIn, setSignIn] = useState({} as SignIn | {});

  // Load the data
  useEffect(() => {
    import("utils/initFirebase")
      .then(async ({ auth, db }) => {
        const createDataObject = await DataObject();
        const { signIn, signUp } = await import('utils/authService');

        setSignIn(() => signIn.bind(this, db, auth));
        setSignUp(() => signUp.bind(this, db, auth));

        return createDataObject;
      })
      .then(async (createDataObject) => {
        const dataObject = await createDataObject();

        setData(dataObject);
      });
  }, []);

  // Set the data
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setCategories((data as DataObject).getCategories());
      setCategoryMap((data as DataObject).getCategoryMap());
      setBooks((data as DataObject).getBooks());
      setBookMap((data as DataObject).getBookMap());
    }
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        user,
        categories,
        categoryMap,
        books,
        bookMap,
        signIn,
        signUp,
        setUser,
      }}
    >
      <RouteSwitch></RouteSwitch>
    </DataContext.Provider>
  );
}

export { App, DataContext };
