const TerserPlugin = require("terser-webpack-plugin");

// const cspHeader = `
//   default-src 'self';
//   script-src 'self' 'unsafe-eval' 'unsafe-inline';
//   style-src 'self' 'unsafe-inline';
//   img-src 'self' data:;
//   font-src 'self';
//   object-src 'none';
//   base-uri 'self';
//   form-action 'self';
//   frame-src 'self' blob:;
//   frame-ancestors 'none';
//   upgrade-insecure-requests;
// `;

module.exports = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    if (!isServer) {
      config.resolve.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: false,
        buffer: false,
      };
    }

    config.optimization.minimizer = [
      new TerserPlugin({
        include: /(@progress\/kendo-react-pdf-viewer|@react-pdf\/renderer)/,
        terserOptions: {
          mangle: false,
          keep_fnames: true,
          keep_classnames: true,
        },
      }),

      new TerserPlugin({
        exclude: /(@progress\/kendo-react-pdf-viewer|@react-pdf\/renderer)/,
      }),
    ];
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
      // {
      //   source: "/(.*)",
      //   headers: [
      //     {
      //       key: "Content-Security-Policy",
      //       value: cspHeader.replace(/\n/g, ""),
      //     },
      //   ],
      // },
    ];
  },
};
