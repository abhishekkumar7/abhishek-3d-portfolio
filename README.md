# Abhishek Kumar Jha: 3D portfolio

A floating campus you walk around with a guide. React + react-three-fiber.

```
npm install
npm run dev     # http://localhost:5174 (or any port)
npm run build   # static site in dist/
```

- Content lives in `src/data/content.ts` (papers, programmes, milestones, what the guide says).
- Each station is a file in `src/three/`; the side panel is in `src/ui/`.
- Jump to a section with a hash: `/#research`, `/#build`, `/#contact`.
- Portrait: `public/media/portrait.webp`.
