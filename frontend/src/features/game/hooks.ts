import { useQuery } from "@tanstack/react-query";
import { getBook } from "./api";

export function useBook(path: string) {
    return useQuery({
        queryKey: ["book", path],
        queryFn: () => getBook(path),
        enabled: !!path,
    });
}