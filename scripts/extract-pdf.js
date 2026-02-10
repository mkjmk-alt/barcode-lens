import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';

async function extractTextFromPdf(pdfPath) {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `\n--- Page ${i} ---\n${pageText}\n`;
        } catch (e) {
            console.error(`Error on page ${i}:`, e);
        }
    }

    return fullText;
}

const pdfFiles = [
    "scripts/Coupang_Corp_Supplier_Inbound_Manual_KR_Ver.3.06.pdf",
    "scripts/coupang_rocket_growth_inbound_guide.pdf"
];

async function main() {
    let results = [];
    for (const file of pdfFiles) {
        console.log(`Extracting ${file}...`);
        const text = await extractTextFromPdf(file);
        results.push({
            title: path.basename(file),
            content: text
        });
    }

    const tsContent = `export const GROUNDING_DOCUMENTS = ${JSON.stringify(results, null, 4)};\n`;
    fs.writeFileSync('src/data/knowledge.ts', tsContent);
    console.log("Updated src/data/knowledge.ts successfully!");
}

main().catch(console.error);
