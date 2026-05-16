import { defineConfig } from "vite";
import { createReadStream, statSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";

// Serve legacy asset directories raw (bypass vite's JS transform pipeline).
// Files under z/ (background music) and ui/audio/ have no file extension on
// disk — vite would otherwise try to parse them as JavaScript modules and
// 500 on the binary content.
//
// Each request is mapped to `<repo>/<urlPath>` and streamed with a best-guess
// Content-Type. Falls through to vite's default handlers if the file is missing.
function rawStaticDirs(repoRoot, prefixes) {
	const MIME = {
		".mp3": "audio/mpeg",
		".ogg": "audio/ogg",
		".wav": "audio/wav",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".otf": "font/otf",
		".ttf": "font/ttf",
		".woff": "font/woff",
		".woff2": "font/woff2",
		"": "audio/mpeg", // z/ files: no extension, but they are mp3s
	};
	return {
		name: "raw-static-dirs",
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = req.url?.split("?")[0] ?? "";
				if (!prefixes.some((p) => url.startsWith(p))) return next();
				const filePath = resolve(repoRoot, "." + decodeURIComponent(url));
				if (!existsSync(filePath)) return next();
				try {
					const stat = statSync(filePath);
					if (!stat.isFile()) return next();
					const ext = extname(filePath).toLowerCase();
					res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
					res.setHeader("Content-Length", String(stat.size));
					createReadStream(filePath).pipe(res);
				} catch {
					next();
				}
			});
		},
	};
}

// For GitHub Pages project sites the build must be served from /<repo>/.
// Override with `BASE_PATH=/ bun run build` for root-domain deploys.
const base = process.env.BASE_PATH ?? "/Heart-Of-Galaxy-Horizon/";

export default defineConfig(({ command }) => ({
	root: ".",
	base: command === "build" ? base : "/",
	publicDir: false,
	appType: "mpa",
	plugins: command === "serve" ? [rawStaticDirs(import.meta.dirname ?? ".", ["/z/", "/ui/audio/"])] : [],
	server: {
		port: 5173,
		open: "/index.html",
		strictPort: false,
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
		assetsInlineLimit: 0,
		rollupOptions: {
			input: "index.html",
		},
	},
}));
