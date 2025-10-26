// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState } from "react";

const Auth: React.FC = () => {
  const [mode, setMode] = useState("signUp");
  const [loading, setLoading] = useState(false);

  const googleAuth = async () => {
    setLoading(true);
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    window.open(`${import.meta.env.VITE_BASE_URL}/oauth/google`, "_self");
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-row justify-center items-center">
      {mode === "signUp" && (
        <button
          className="flex flex-row bg-[#333333] h-10 rounded-lg gap-3 p-10 items-center justify-center"
          onClick={googleAuth}
        >
          <div className="flex items-center justify-between">
            <img
              className="w-4 "
              src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
            />
          </div>
          <div className="flex items-center justify-center text-white">
            Continue with Google
          </div>
        </button>
      )}
    </div>
  );
};

export default Auth;
