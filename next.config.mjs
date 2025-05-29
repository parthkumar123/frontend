import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on APP_ENV
dotenv.config({
    path: path.resolve(process.cwd() + "/env", process.env.APP_ENV + '.env')
});

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            },
        ],
    },
    // Expose API endpoint to the browser
    env: {
        API_BASE_URL: process.env.API_BASE_URL
    },
};

export default nextConfig;
