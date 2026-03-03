import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToUpdate = [
    "src/app/admin/login/page.tsx",
    "src/lib/email.ts",
    "src/app/api/test-email/route.ts",
    "src/app/api/webhook/mercadopago/route.ts",
    "src/app/admin/page.tsx",
    "src/app/api/cron/nurturing/route.ts",
    "src/app/api/checkout/mercadopago/process/route.ts",
    "src/app/layout.tsx"
];

for (const relPath of filesToUpdate) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        let newContent = content.replace(/Equipe Vida com Aroma/g, "Equipe A Vida com Aroma");
        newContent = newContent.replace(/© 2025 Vida com Aroma/g, "© 2025 A Vida com Aroma");
        newContent = newContent.replace(/Vida com Aroma — Admin/g, "A Vida com Aroma — Admin");
        newContent = newContent.replace(/Vida com Aroma — Aromaterapia/g, "A Vida com Aroma — Aromaterapia");
        newContent = newContent.replace(/— Vida com Aroma/g, "— A Vida com Aroma");
        newContent = newContent.replace(/VIDA COM AROMA/g, "A VIDA COM AROMA");
        newContent = newContent.replace(/Vida com Aroma </g, "A Vida com Aroma <");
        newContent = newContent.replace(/"Vida com Aroma"/g, `"A Vida com Aroma"`);
        newContent = newContent.replace(/'Vida com Aroma'/g, `'A Vida com Aroma'`);
        newContent = newContent.replace(/>Vida com Aroma</g, `>A Vida com Aroma<`);

        if (content !== newContent) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`✅ Updated: ${relPath}`);
        } else {
            console.log(`⚠️ No changes needed: ${relPath}`);
        }
    } else {
        console.warn(`❌ Not found: ${relPath}`);
    }
}
