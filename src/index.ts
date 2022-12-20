import * as utils from '@core/utils/utils';
import FileController from "@modules/file/file.controller";

// Define the Worker logic
const corsHeaders = {
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
};

const worker: ExportedHandler = {
    async fetch(req: Request, env: any) {
        const url = new URL(req.url);

        if (req.method === "OPTIONS") {
            let headers = req.headers;
            if (
                headers.get('Origin') !== null &&
                headers.get('Access-Control-Request-Method') !== null &&
                headers.get('Access-Control-Request-Headers') !== null
            ) {
                let respHeaders = {
                    ...corsHeaders,
                    'Access-Control-Allow-Headers': req.headers.get('Access-Control-Request-Headers') || "Content-Type, Authorization, Content-Length, X-Requested-With",
                };

                return new Response(JSON.stringify(null), {
                    headers: respHeaders,
                });
            } else {
                return new Response(JSON.stringify(null), {
                    headers: {
                        Allow: 'GET, HEAD, POST, OPTIONS',
                    },
                });
            }
        }

        const path = url.pathname.replace(/[/]$/, '');
        const firstPath = path.split('/')[1];
        const supportedMethods = ['GET', 'POST', 'OPTIONS'];

        if (supportedMethods.includes(req.method) && firstPath === 'file') {
            return await FileController(req, env);
        }

        return utils.toError('Method not allowed.', 405);
    }
}

export default worker;
