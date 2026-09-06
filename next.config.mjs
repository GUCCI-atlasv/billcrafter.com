/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pinned rather than left to the default: Search Console crawled both /ja and
  // /ja/ as separate URLs. One canonical form, and /ja/ 308s to /ja.
  trailingSlash: false,
  // For Cloudflare deployment use @opennextjs/cloudflare (see README).
  // No `output: 'export'` — we keep server routes (API stubs) available.
  async redirects() {
    return [
      // Vietnam shipped briefly as /vi (language code). Canonical host path is
      // /vn (country), matching how we talk about the market (VN).
      { source: "/vi", destination: "/vn", permanent: true },
      { source: "/vi/:path*", destination: "/vn/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
