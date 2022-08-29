import { defineConfig } from "tsup";

export default defineConfig({
    name: "tsup",
    target: "node16",
    entry: ["src/index.ts"],
    outDir: "dist",
    minify: true,
    clean: true,
    dts: true,
});
