/**
 * translate_notion_page.js
 * 
 * Reads a Notion page recursively, translates all text content EN→ES
 * using Antigravity agent's output, and creates a new translated page.
 * 
 * Usage: node tools/translate_notion_page.js <source_page_id> [parent_page_id]
 * 
 * This script:
 * 1. Reads all blocks recursively from the source page
 * 2. Outputs a JSON structure with all blocks to .tmp/page_blocks.json
 * 3. Later, receives translated blocks and creates the new page
 */

const fs = require('fs');
const https = require('https');

const envPath = 'c:/Users/Pity/Desktop/Antigravity Skills/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const notionToken = (envContent.match(/NOTION_API_KEY=([^\s]+)/) || [])[1]?.trim();

if (!notionToken) {
    console.error("❌ NOTION_API_KEY no encontrada en .env");
    process.exit(1);
}

const RECURSOS_PAGE_ID = '31109638-4773-809c-8b75-d8b14f541277';

function notionRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: 'api.notion.com', path, method,
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
        };
        const req = https.request(opts, res => {
            let b = '';
            res.on('data', d => b += d);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(b));
                } else {
                    reject(new Error(`Notion ${res.statusCode}: ${b.substring(0, 300)}`));
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function getBlockChildren(blockId) {
    let allBlocks = [];
    let cursor = undefined;
    do {
        const path = `/v1/blocks/${blockId}/children?page_size=100${cursor ? '&start_cursor=' + cursor : ''}`;
        const result = await notionRequest(path);
        allBlocks = allBlocks.concat(result.results);
        cursor = result.has_more ? result.next_cursor : null;
    } while (cursor);
    return allBlocks;
}

async function readPageRecursive(pageId, depth = 0) {
    const blocks = await getBlockChildren(pageId);
    const result = [];

    for (const block of blocks) {
        const entry = {
            id: block.id,
            type: block.type,
            has_children: block.has_children,
            data: block[block.type],
            children: []
        };

        // Read children recursively for blocks that support nesting
        if (block.has_children && !['child_page', 'child_database'].includes(block.type)) {
            entry.children = await readPageRecursive(block.id, depth + 1);
        }

        result.push(entry);
    }
    return result;
}

async function getPageTitle(pageId) {
    const page = await notionRequest(`/v1/pages/${pageId}`);
    const titleProp = page.properties?.title || page.properties?.Title;
    if (titleProp?.title?.[0]?.plain_text) return titleProp.title[0].plain_text;
    // Try Name property
    for (const [key, val] of Object.entries(page.properties || {})) {
        if (val.type === 'title' && val.title?.[0]?.plain_text) return val.title[0].plain_text;
    }
    return 'Sin título';
}

function extractText(blocks, indent = '') {
    let output = '';
    for (const b of blocks) {
        const richText = b.data?.rich_text || [];
        const text = richText.map(r => r.plain_text).join('');

        let prefix = '';
        if (b.type.includes('heading')) prefix = '## ';
        if (b.type === 'bulleted_list_item') prefix = '• ';
        if (b.type === 'numbered_list_item') prefix = '1. ';
        if (b.type === 'code') prefix = '[CODE] ';
        if (b.type === 'callout') prefix = '[CALLOUT] ';
        if (b.type === 'toggle') prefix = '[TOGGLE] ';
        if (b.type === 'quote') prefix = '[QUOTE] ';
        if (b.type === 'divider') { output += indent + '---\n'; continue; }
        if (b.type === 'child_page') { output += indent + `[CHILD_PAGE: ${b.data?.title}]\n`; continue; }

        if (text) output += `${indent}${prefix}${text}\n`;

        if (b.children.length > 0) {
            output += extractText(b.children, indent + '  ');
        }
    }
    return output;
}

async function createTranslatedPage(title, parentId, translatedBlocks) {
    // Create page
    const page = await notionRequest('/v1/pages', 'POST', {
        parent: { page_id: parentId },
        properties: {
            title: [{ text: { content: title } }]
        },
        children: translatedBlocks.slice(0, 100)
    });

    console.log(`✅ Página creada: ${page.url}`);

    // Append remaining blocks if any
    if (translatedBlocks.length > 100) {
        for (let i = 100; i < translatedBlocks.length; i += 100) {
            const batch = translatedBlocks.slice(i, i + 100);
            await notionRequest(`/v1/blocks/${page.id}/children`, 'PATCH', { children: batch });
            console.log(`  📦 Batch ${Math.floor(i / 100) + 1} enviado`);
        }
    }

    return page;
}

// --- Mode: READ ---
async function readMode(sourcePageId) {
    console.log('⏳ Leyendo página fuente...');
    const title = await getPageTitle(sourcePageId);
    console.log(`📄 Título: ${title}`);

    const blocks = await readPageRecursive(sourcePageId);
    console.log(`📦 Total blocks: ${blocks.length}`);

    // Save raw blocks
    fs.writeFileSync(
        'c:/Users/Pity/Desktop/Antigravity Skills/.tmp/page_blocks.json',
        JSON.stringify({ title, sourceId: sourcePageId, blocks }, null, 2)
    );

    // Print readable text
    const readable = extractText(blocks);
    fs.writeFileSync(
        'c:/Users/Pity/Desktop/Antigravity Skills/.tmp/page_readable.txt',
        `# ${title}\n\n${readable}`
    );

    console.log(`\n📖 Contenido legible:\n`);
    console.log(readable.substring(0, 3000));
    if (readable.length > 3000) console.log(`\n... (${readable.length} chars total, guardado en .tmp/page_readable.txt)`);

    console.log('\n✅ Datos guardados en .tmp/page_blocks.json y .tmp/page_readable.txt');
}

// --- Mode: WRITE ---
async function writeMode(translatedTitle, parentPageId) {
    console.log('⏳ Creando página traducida...');
    const data = JSON.parse(
        fs.readFileSync('c:/Users/Pity/Desktop/Antigravity Skills/.tmp/translated_blocks.json', 'utf8')
    );

    const page = await createTranslatedPage(translatedTitle, parentPageId, data.blocks);
    console.log(`✅ ¡Traducción completada! (${data.blocks.length} bloques)`);
}

// --- Main ---
async function main() {
    const mode = process.argv[2];

    if (mode === 'read') {
        const sourceId = process.argv[3];
        if (!sourceId) { console.error('Uso: node translate_notion_page.js read <page_id>'); process.exit(1); }
        await readMode(sourceId);
    } else if (mode === 'write') {
        const title = process.argv[3];
        const parentId = process.argv[4] || RECURSOS_PAGE_ID;
        if (!title) { console.error('Uso: node translate_notion_page.js write "<título>" [parent_id]'); process.exit(1); }
        await writeMode(title, parentId);
    } else {
        console.log('Uso:');
        console.log('  node translate_notion_page.js read <page_id>     -- Lee y exporta bloques');
        console.log('  node translate_notion_page.js write "<título>"   -- Crea página traducida');
    }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
