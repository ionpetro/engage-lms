"use client";
import React, { useEffect } from "react";
import { getRefreshToken, getUserInfo } from "../../services/auth/auth";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext: any = React.createContext({});

const NON_AUTHENTICATED_ROUTES = ["/login", "/signup"];
export interface Auth {
  access_token: string;
  isAuthenticated: boolean;
  userInfo: {};
  isLoading: boolean;
}

const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [auth, setAuth] = React.useState<Auth>({ access_token: "", isAuthenticated: false, userInfo: {}, isLoading: true });

  async function checkRefreshToken() {
    let data = await getRefreshToken();
    if (data) {
      return data.access_token;
    }
  }

  async function checkAuth() {
    try {
      let access_token = await checkRefreshToken();
      let userInfo = {};
      let isLoading = false;

      if (access_token) {
        userInfo = await getUserInfo(access_token);
        setAuth({ access_token, isAuthenticated: true, userInfo, isLoading });

        
      } else {
        setAuth({ access_token, isAuthenticated: false, userInfo, isLoading });
        //router.push("/login");
      }
    } catch (error) {
      router.push("/");
    }
  }

  useEffect(() => {
    if (auth.isLoading) {
      checkAuth();
    }
    return () => {
      auth.isLoading = false;
    };
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
