import * as React from "react";

const LoginPage = React.lazy(() => import("./login"));

export default function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </React.Suspense>
    </div>
  );
}
