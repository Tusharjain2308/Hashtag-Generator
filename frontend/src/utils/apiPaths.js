export const BASE_URL="http://localhost:8000"

export const API_PATHS = {
    AUTH : {
        LOGIN :'/api/auth/login',
        REGISTER :'/api/auth/register',
        USER_INFO : '/api/auth/me',
    }, 
    HASHTAGS : {
        GENERATE : `${BASE_URL}/api/hashtags/generate`,
        ACCOUNT_INFO : `${BASE_URL}/api/hashtags/account`,
        DELETE : (hashId) => `/api/hashtags/${hashId}`,
    }
}