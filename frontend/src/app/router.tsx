import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../features/books/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
]);