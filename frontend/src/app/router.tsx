import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../features/books/HomePage";
import { GamePage } from "../features/game/GamePage";

export const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/game/:path", element: <GamePage /> },
]);
