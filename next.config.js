module.exports = {
    swcMinify: true,
    publicRuntimeConfig: {
        // Will be available on both server and client
        NEXT_PUBLIC_GITHUB_APP_NAME: process.env.NEXT_PUBLIC_GITHUB_APP_NAME,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
}