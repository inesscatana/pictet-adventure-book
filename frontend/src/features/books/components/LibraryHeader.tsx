import { Icon } from "../../../ui/Icon";

export function LibraryHeader() {
    return (
        <div className="text-center">
            <h2 className="text-4xl font-extrabold">
                <Icon name="book" label="Library" className="mr-2" />
                The Adventure Library
            </h2>
            <p className="mt-3 text-[#6b5647] max-w-3xl mx-auto">
                Choose your next adventure from our collection of interactive tales. Each book offers unique paths and
                multiple endings based on your choices.
            </p>
        </div>
    );
}
