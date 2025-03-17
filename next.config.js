/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Other Next.js config options
}

// This function is used when running `next dev` or `next start`
module.exports = {
  ...nextConfig,
  // This doesn't actually change the port directly, but it's a good place to document it
  // The actual port change happens in package.json or .env
}

// You can also add a comment to remind yourself about the port change
// To change port: Use `next dev -p 3001` or set PORT=3001 in .env 