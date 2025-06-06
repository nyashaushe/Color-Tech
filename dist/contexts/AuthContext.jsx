"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/services/api"));
const jwt_1 = __importDefault(require("@/lib/jwt"));
const use_toast_1 = require("@/components/ui/use-toast");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const toast = use_toast_1.useToast ? (0, use_toast_1.useToast)() : null;
    // Check for existing session on mount
    (0, react_1.useEffect)(() => {
        const token = jwt_1.default.getToken();
        if (token) {
            setIsLoading(true);
            // Verify token and get user data
            api_1.default.get('/auth/profile')
                .then(response => {
                const apiUser = response.data.user;
                // Convert API user to our application user format
                setUser({
                    id: apiUser.id,
                    email: apiUser.email,
                    fullName: apiUser.fullName ||
                        (apiUser.first_name && apiUser.last_name ?
                            `${apiUser.first_name} ${apiUser.last_name}` :
                            apiUser.email),
                    role: apiUser.role
                });
                setError(null);
            })
                .catch((err) => {
                console.error('Session verification failed:', err);
                jwt_1.default.removeToken();
                setError('Your session has expired. Please log in again.');
                if (toast?.toast) {
                    toast.toast({
                        title: 'Session Expired',
                        description: 'Your session has expired. Please log in again.',
                        variant: 'destructive',
                    });
                }
            })
                .finally(() => {
                setIsLoading(false);
            });
        }
    }, []);
    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);
            // Make actual login API call
            const response = await api_1.default.post('/auth/login', { email, password });
            // Extract token and user data from response
            const { token, user: apiUser } = response.data;
            if (!token) {
                throw new Error('No token received from server');
            }
            // Store the real token
            jwt_1.default.setToken(token);
            // Format user data based on the API response structure
            const userData = {
                id: apiUser.id,
                email: apiUser.email,
                fullName: apiUser.fullName ||
                    (apiUser.first_name && apiUser.last_name ?
                        `${apiUser.first_name} ${apiUser.last_name}` :
                        apiUser.email),
                role: apiUser.role
            };
            setUser(userData);
            if (toast?.toast) {
                toast.toast({
                    title: 'Login Successful',
                    description: `Welcome back, ${userData.fullName}!`,
                });
            }
            return response.data;
        }
        catch (err) {
            console.error('Login failed:', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            if (toast?.toast) {
                toast.toast({
                    title: 'Login Failed',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            setIsLoading(true);
            // Call logout API if available
            const token = jwt_1.default.getToken();
            if (token) {
                await api_1.default.post('/auth/logout');
            }
            setUser(null);
            jwt_1.default.removeToken();
            if (toast?.toast) {
                toast.toast({
                    title: 'Logged Out',
                    description: 'You have been successfully logged out.',
                });
            }
        }
        catch (err) {
            console.error('Logout error:', err);
            // Even if the API call fails, we should still clear local state
            setUser(null);
            jwt_1.default.removeToken();
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading,
            error
        }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
exports.default = AuthContext;
//# sourceMappingURL=AuthContext.jsx.map