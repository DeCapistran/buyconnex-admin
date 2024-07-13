export const environment = {
    production: false,
    backend_url: "http://localhost:8080/buyconnex-back",
    http_buyconnex_token: "HTTP_BUYCONNEX_TOKEN",
    logging: {
        http: {
            level: 'debug',
            logRequest: true,
            logResponse: true,
        },
    },
};