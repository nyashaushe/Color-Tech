"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useData = useData;
const react_1 = require("react");
const use_toast_1 = require("@/components/ui/use-toast");
function useData(fetchFn, dependencies = []) {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const { toast } = (0, use_toast_1.useToast)();
    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await fetchFn();
            setData(result);
            setError(null);
        }
        catch (err) {
            setError(err);
            toast({
                title: "Error",
                description: "Failed to fetch data",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies]);
    return { data, loading, error, refetch: fetchData };
}
//# sourceMappingURL=useData.js.map