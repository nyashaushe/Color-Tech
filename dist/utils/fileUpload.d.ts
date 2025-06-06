import multer from 'multer';
declare global {
    namespace Express {
        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
        }
    }
}
export declare const uploadImage: multer.Multer;
export declare const deleteFile: (filePath: string) => Promise<void>;
export declare const getFileUrl: (filename: string, type?: "gallery" | "vehicles" | "services" | "profiles") => string;
declare const _default: {
    uploadImage: multer.Multer;
    deleteFile: (filePath: string) => Promise<void>;
    getFileUrl: (filename: string, type?: "gallery" | "vehicles" | "services" | "profiles") => string;
};
export default _default;
