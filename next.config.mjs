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
};

export default nextConfig;
