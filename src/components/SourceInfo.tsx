export function SourceInfo({ source, isLoading }: { source: "gps" | "ip" | "search" | null, isLoading: boolean }) {
    return (
        <div className="text-center text-xs sm:text-sm text-gray-600 mt-auto">
            {source && !isLoading && (
                <span>
                    Weather forecast based on your{" "}
                    <span className="font-bold">
                        {source === "gps" ? "device location" : source === "ip" ? "IP address" : "search"}
                    </span>
                </span>
            )}
        </div>
    );
}
