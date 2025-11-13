import { KeyboardEventHandler, useState } from "react";

interface Props {
  onKeyDownFn: KeyboardEventHandler<HTMLInputElement>;
  alias: string;
  setAlias: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          value={props.alias}
          onKeyDown={props.onKeyDownFn}
          onChange={(e) => props.setAlias(e.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          value={props.password}
          onKeyDown={props.onKeyDownFn}
          onChange={(e) => props.setPassword(e.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;