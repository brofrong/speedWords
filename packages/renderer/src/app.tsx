import { Component, onCleanup, onMount } from "solid-js";
import { Link, useRoutes, useLocation, Router, useNavigate } from "@solidjs/router";

import { routes } from "./routes";

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  const navigate = useNavigate();

  function keyPressed(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      navigate('/', { replace: true });
    }
  }

  onMount(() => {
    document.addEventListener('keydown', keyPressed);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', keyPressed);
  })

  return (
    <div class='w-screen h-screen flex flex-col'>
      <main class='flex-grow'>
        <Route />
      </main>
    </div>
  );
};

export default App;
