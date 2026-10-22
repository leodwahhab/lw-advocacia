// Gera a foto provisória (4:5) usada até chegar o retrato real. Rode uma vez: node scripts/gerar-placeholder.mjs
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#ece7da"/>
  <circle cx="600" cy="560" r="190" fill="#d9d2c3"/>
  <path d="M230 1500c0-260 166-470 370-470s370 210 370 470z" fill="#d9d2c3"/>
  <text x="600" y="1400" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#5c564b">Foto provisória · troque pelo painel</text>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile('assets/fotos/placeholder-retrato.jpg');
console.log('assets/fotos/placeholder-retrato.jpg criado');
