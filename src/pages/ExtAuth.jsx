import React, { useEffect, useRef } from "react";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useNavigate } from "react-router-dom";

export function ExtAuth({ onLogin }) {
  const { api, setUser, login } = useApi();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await api.auth.getUserSession();

        if (!session?.idToken) {
          navigate("/login");
          return;
        }

        await login(session.idToken);

        const user = await api.auth.loadUserDetails();
        setUser(user);

        onLogin?.();

        navigate("/dashboard", { replace: true });
      } catch (err) {
        navigate("/login");
      }
    };

    init();
  }, []);

  return <>Loading...</>;
}
