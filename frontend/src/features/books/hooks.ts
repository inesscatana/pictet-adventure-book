import { useQuery } from "@tanstack/react-query";
import { getBooks } from "./api";

export function useBooks() {
    return useQuery({
        queryKey: ["books"],
        queryFn: getBooks,
    });
}
