const CHUNK_PUBLIC_PATH = "server/pages/about.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_ab7cab._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__7a088f._.js");
runtime.loadChunk("server/chunks/ssr/src_styles_globals_070f83.css");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/src/pages/about.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/node_modules/next/document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/src/pages/_app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
