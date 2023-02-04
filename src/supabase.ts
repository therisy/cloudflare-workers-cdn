import {createClient} from "@supabase/supabase-js";
import {BUCKET} from "@constants";

const SUPABASE_URL = "";
const SUPABASE_KEY = "";

export const SUPABASE = createClient(SUPABASE_URL, SUPABASE_KEY);

export const uploadFile = async (name: string, buffer: ArrayBuffer) => {
    const {error} = await SUPABASE.storage.from(BUCKET).upload(name, buffer);

    if (error) {
        console.log(error);
        return error;
    }
}

export const getBuffer = async (fileId: string)  => {
    const {data, error} = await SUPABASE.storage.from(BUCKET).download(fileId);

    if (error) {
        console.log(error);
        return error;
    }

    return data;
}
