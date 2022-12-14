const { exec } = require("child_process");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('AfterEmitPlugin', (compilation, callback) => {
          exec('ts-node -P scripts/tsconfig.json scripts/create-webp-fallbacks.ts', () => {
            callback();
          })
        })
      }
    })

    return config
  },
}

module.exports = nextConfig;
