export const MAX_AGE = 60 * 60 * 24 * 2; // 2 days
export const BUCKET = "files";
export const SITE_URL = "https://cdn.risy.workers.dev";
export const SITE_PATH = "file";
export const ONE_MB = 1024 * 1024;
export const MAX_FILE_SIZE = ONE_MB * 10; // 10 MB

export function toJSON(data: unknown, status = 200, ttl = 1500): Response {
    let body = JSON.stringify(data, null, 2);
    return new Response(body, {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `max-age=${ttl}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
            'Origin': '*',
        }
    });
}

export function toError(error: string | unknown, status = 400): Response {
    return toJSON({error}, status);
}