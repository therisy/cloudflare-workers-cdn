import {Generator} from "snowflake-generator";
import {getBuffer, uploadFile} from "@supabase";
import {toError} from "@core/utils";
import {MAX_AGE, MAX_FILE_SIZE, SITE_PATH, SITE_URL} from "@constants";

const MIME_TYPES = ["image/png", "image/jpeg", "image/gif"];

export const fileUpload = async (req: Request, env: unknown): Promise<Response> => {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    if (!image) {
        return toError("No image provided", 400);
    }

    if (!MIME_TYPES.includes(image.type)) {
        return toError("Invalid file type", 400);
    }

    const size = image.size;
    if (size > MAX_FILE_SIZE) {
        return toError("File size too large", 413);
    }

    const buffer = await image.arrayBuffer();

    const SnowflakeGenerator = new Generator(1420070400000);
    const fileId: bigint | bigint[] = SnowflakeGenerator.generate();

    const name = `${fileId}.${image.name.split(".").pop()}`;

    const uploadResult = await uploadFile(name, buffer);
    if (uploadResult) {
        return toError("Error uploading file", 500);
    }

    return new Response(`${SITE_URL}/${SITE_PATH}/${name}`);
}

export const getFile = async (fileId: string): Promise<Response> => {
    const buffer = await getBuffer(fileId);
    if (buffer instanceof Error) {
        return toError("Error getting file", 500);
    }

    return new Response(buffer, {
        headers: {
            'content-type': 'image/png',
            'Cache-Control': `max-age=${MAX_AGE}`,
        }
    });
}