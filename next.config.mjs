/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    additionalData: `
      @use "@/assets/variables" as *;
      @use "@/assets/mixins" as *;
    `,
  },
};

export default nextConfig;
