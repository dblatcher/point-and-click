/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')()
const nextConfig = withMDX({
  reactStrictMode: false,
})

module.exports = nextConfig
