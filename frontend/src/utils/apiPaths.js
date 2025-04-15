export const BASE_URL="http://localhost:8000"

export const API_PATHS = {
    AUTH : {
        LOGIN :'/api/auth/login',
        REGISTER :'/api/auth/register',
        USER_INFO : '/api/auth/me',
    }, 
    HASHTAGS : {
        GENERATE : `${BASE_URL}/api/hashtags/generate`,
        HISTORY : '/api/hashtags/history',
        GET_SINGLE_HASHTAG : (hashId) => `/api/hashtags/${hashId}`,
        DELETE : (hashId) => `/api/hashtags/${hashId}`,
    }
}