import * as utils from "@core/utils/utils";
import {fileUpload, getFile} from "./file.service";

async function FileController(req: Request, env: unknown): Promise<Response> {
    if (req.method == "POST") {
        return fileUpload(req, env);
    }

    if (req.method == "GET") {
        const fileId = req.url.split("/").pop() as string;
        return getFile(fileId)
    }
    
    if (req.method == "OPTIONS") {
        return utils.toJSON({}, 200);
    }

    return utils.toError("Method not allowed", 405);
}

export default FileController;