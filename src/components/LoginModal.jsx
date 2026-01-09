import { useState } from "react";
import { DEFAULT_USERNAME, DEFAULT_PASSWORD } from "@/constants/auth";
import { login } from "@/utils/fetcher";
import style from "./LoginModal.module.scss";

function LoginModal({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({ username, password });

      // When login helper returns a raw Response (non-ok), handle status here
      if (result instanceof Response && !result.ok) {
        if (result.status === 401) {
          setError("帳號或密碼錯誤，請再試一次。");
        } else {
          setError("登入失敗，請稍後再試。");
        }
        return;
      }

      if (result?.token) {
        onSuccess(result.token);
        setError("");
        return;
      }

      setError("登入失敗，請稍後再試。");
    } catch (err) {
      setError("登入失敗，請稍後再試。");
    }
  };

  return (
    <div className={style.loginModalBackdrop}>
      <div className={style.loginModal}>
        <h2>請先登入</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-username">
            帳號
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label htmlFor="login-password">
            密碼
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <span>
            提示：帳號：{DEFAULT_USERNAME} 密碼：{DEFAULT_PASSWORD}
          </span>
          {error && <p className={style.loginError}>{error}</p>}
          <button type="submit">登入</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
