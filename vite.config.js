import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path do site.
// - Netlify, Vercel ou domínio próprio: use "/" (padrão abaixo, não precisa mexer).
// - GitHub Pages: precisa do caminho "/nome-do-repositorio/". O workflow em
//   .github/workflows/deploy.yml já define a variável GITHUB_PAGES=true
//   automaticamente, então troque apenas o nome do repositório na linha abaixo.
const repoName = "nome-do-repositorio";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? `/${repoName}/` : "/",
});
