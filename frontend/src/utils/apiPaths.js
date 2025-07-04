export const BASE_URL="https://hashtag-generator-backend.onrender.com"; 
//http://hashpopbackend-env.eba-phdktvkm.ap-south-1.elasticbeanstalk.com
//"https://hashtag-generator-backend.onrender.com"
//
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