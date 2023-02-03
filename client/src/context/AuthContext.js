import React from "react";

const AuthContext = React.createContext({
  userAuth: false,
  setUserAuth: () => {},
});

export default AuthContext;
