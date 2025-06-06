export declare const config: {
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
    uploads: {
        maxSize: number;
        directory: string;
    };
    logging: {
        level: string;
        file: string;
    };
    cors: {
        origin: string;
        methods: string;
    };
};
export default config;
