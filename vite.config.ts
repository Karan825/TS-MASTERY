import { defineConfig } from "vite";
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

export default defineConfig({
  root: "frontend",
  base: "./",
  server: {
    port: 5173,
    host: "localhost"
  },
  plugins: [
    {
      name: "typescript-runner-backend",
      configureServer(server) {
        server.middlewares.use("/api/run-code", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }

          let body = "";
          req.on("data", chunk => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const { code } = JSON.parse(body);
              const scratchDir = path.resolve(process.cwd(), "frontend", ".scratch");
              if (!fs.existsSync(scratchDir)) {
                fs.mkdirSync(scratchDir, { recursive: true });
              }

              const tempFile = path.join(scratchDir, `run_${Date.now()}.ts`);
              fs.writeFileSync(tempFile, code, "utf-8");

              const startTime = Date.now();
              const proc = spawn("npx", ["tsx", tempFile], {
                shell: true,
                cwd: process.cwd()
              });

              let output = "";
              let errorOutput = "";

              proc.stdout.on("data", data => {
                output += data.toString();
              });

              proc.stderr.on("data", data => {
                errorOutput += data.toString();
              });

              // 4 second timeout guard
              const timer = setTimeout(() => {
                proc.kill();
                output += "\n[TIMEOUT ERROR] Execution timed out after 4000ms.";
              }, 4000);

              proc.on("close", code => {
                clearTimeout(timer);
                try {
                  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                } catch {}

                const finalOutput = (output + (errorOutput ? "\n" + errorOutput : "")).trim();
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  success: code === 0,
                  output: finalOutput || "Program executed successfully with no console output.",
                  durationMs: Date.now() - startTime
                }));
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                success: false,
                output: `Internal Error: ${err.message}`
              }));
            }
          });
        });
      }
    }
  ]
});
