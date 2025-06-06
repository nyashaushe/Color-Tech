export declare const config: {
    apiUrl: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    server: {
        port: string | number;
        env: string;
    };
    db: {
        host: string;
        user: string;
        password: string;
        database: string;
        port: number;
    };
};
export default config;
