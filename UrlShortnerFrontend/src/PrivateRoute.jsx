import { Navigate } from "react-router-dom";
import { useStoreContext } from "./contextApi/ContextApi";
import Loader from "./components/Loader";

export default function PrivateRoute({ children, publicPage}) {
    const { token, loading } = useStoreContext();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader />
            </div>
        );
    }

    if (publicPage) {
        return token ? <Navigate to="/dashboard" /> : children;
    }

    return !token ? <Navigate to="/login" /> : children;
}