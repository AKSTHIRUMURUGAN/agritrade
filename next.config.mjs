import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
           { hostname:"utfs.io" },
           { hostname:"images.unsplash.com" },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
