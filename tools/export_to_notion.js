/**
 * export_to_notion.js - Motor de exportación RICO a Notion
 * 
 * Lee un JSON enriquecido con "steps" tipados y genera una página
 * completa en Notion con bloques ricos: headings, code, callouts,
 * numbered_list, toggle, quote, divider, table_of_contents, etc.
 * 
 * Límite Notion: 2000 chars por bloque de texto. Se auto-divide.
 * Límite Notion: 100 children por request. Se pagina con append.
 */

const fs = require('fs');
const https = require('https');

// --- Config ---
const envPath = 'c:/Users/Pity/Desktop/Antigravity Skills/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const notionToken = (envContent.match(/NOTION_API_KEY=([^\s]+)/) || [])[1]?.trim();
const databaseId = (envContent.match(/NOTION_DATABASE_ID=([^\s]+)/) || [])[1]?.trim();

if (!notionToken || !databaseId) {
    console.error("❌ NOTION_API_KEY o NOTION_DATABASE_ID faltantes en .env");
    process.exit(1);
}

// --- Helpers ---
const MAX_TEXT = 1900; // Notion limit is 2000, we use 1900 for safety

function richText(content, opts = {}) {
    const rt = { text: { content } };
    if (opts.bold) rt.annotations = { ...rt.annotations, bold: true };
    if (opts.italic) rt.annotations = { ...rt.annotations, italic: true };
    if (opts.code) rt.annotations = { ...rt.annotations, code: true };
    if (opts.color) rt.annotations = { ...rt.annotations, color: opts.color };
    return rt;
}

function splitText(text) {
    if (text.length <= MAX_TEXT) return [text];
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
        if (remaining.length <= MAX_TEXT) {
            chunks.push(remaining);
            break;
        }
        // Split at last newline before limit, or at limit
        let splitAt = remaining.lastIndexOf('\n', MAX_TEXT);
        if (splitAt < MAX_TEXT * 0.5) splitAt = MAX_TEXT; // If no good split point
        chunks.push(remaining.substring(0, splitAt));
        remaining = remaining.substring(splitAt).replace(/^\n/, '');
    }
    return chunks;
}

// --- Block Builders ---
function buildBlocks(steps) {
    const blocks = [];

    for (const step of steps) {
        switch (step.type) {
            case 'table_of_contents':
                blocks.push({
                    object: 'block', type: 'table_of_contents',
                    table_of_contents: { color: 'default' }
                });
                break;

            case 'heading_1':
                blocks.push({
                    object: 'block', type: 'heading_1',
                    heading_1: { rich_text: [richText(step.content || step.title)], is_toggleable: false }
                });
                break;

            case 'heading_2':
                blocks.push({
                    object: 'block', type: 'heading_2',
                    heading_2: { rich_text: [richText(step.content || step.title)], is_toggleable: false }
                });
                break;

            case 'heading_3':
                blocks.push({
                    object: 'block', type: 'heading_3',
                    heading_3: { rich_text: [richText(step.content || step.title)] }
                });
                break;

            case 'text':
            case 'paragraph':
                for (const chunk of splitText(step.content || step.explanation || '')) {
                    blocks.push({
                        object: 'block', type: 'paragraph',
                        paragraph: { rich_text: [richText(chunk)] }
                    });
                }
                break;

            case 'code':
                for (const chunk of splitText(step.content || step.explanation || '')) {
                    blocks.push({
                        object: 'block', type: 'code',
                        code: {
                            rich_text: [richText(chunk)],
                            language: step.language || 'plain text',
                            caption: step.caption ? [richText(step.caption)] : []
                        }
                    });
                }
                break;

            case 'callout':
                for (const chunk of splitText(step.content || step.explanation || '')) {
                    blocks.push({
                        object: 'block', type: 'callout',
                        callout: {
                            rich_text: [richText(chunk)],
                            icon: { emoji: step.icon || '💡' },
                            color: step.color || 'blue_background'
                        }
                    });
                }
                break;

            case 'numbered_list':
                const items = step.items || (step.content || '').split('\n').filter(Boolean);
                for (const item of items) {
                    blocks.push({
                        object: 'block', type: 'numbered_list_item',
                        numbered_list_item: { rich_text: [richText(item)] }
                    });
                }
                break;

            case 'bulleted_list':
                const bItems = step.items || (step.content || '').split('\n').filter(Boolean);
                for (const item of bItems) {
                    blocks.push({
                        object: 'block', type: 'bulleted_list_item',
                        bulleted_list_item: { rich_text: [richText(item)] }
                    });
                }
                break;

            case 'quote':
                blocks.push({
                    object: 'block', type: 'quote',
                    quote: { rich_text: [richText(step.content || step.explanation || '')] }
                });
                break;

            case 'divider':
                blocks.push({
                    object: 'block', type: 'divider', divider: {}
                });
                break;

            case 'toggle':
                const toggleChildren = [];
                if (step.children) {
                    toggleChildren.push(...buildBlocks(step.children));
                } else {
                    // Put content as paragraph inside toggle
                    for (const chunk of splitText(step.content || '')) {
                        toggleChildren.push({
                            object: 'block', type: 'paragraph',
                            paragraph: { rich_text: [richText(chunk)] }
                        });
                    }
                }
                blocks.push({
                    object: 'block', type: 'toggle',
                    toggle: {
                        rich_text: [richText(step.title || 'Ver más detalles')],
                        children: toggleChildren.slice(0, 100)
                    }
                });
                break;

            case 'diagram':
                // Notion no soporta Mermaid nativo, usamos un code block con hint
                blocks.push({
                    object: 'block', type: 'callout',
                    callout: {
                        rich_text: [richText(`📊 Diagrama de flujo:\n${step.content || step.explanation || ''}`)],
                        icon: { emoji: '📊' },
                        color: 'purple_background'
                    }
                });
                break;

            default:
                // Fallback: paragraph
                for (const chunk of splitText(step.content || step.explanation || JSON.stringify(step))) {
                    blocks.push({
                        object: 'block', type: 'paragraph',
                        paragraph: { rich_text: [richText(chunk)] }
                    });
                }
        }
    }
    return blocks;
}

// --- Notion API ---
function notionRequest(path, method, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
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
                    reject(new Error(`Notion ${res.statusCode}: ${b}`));
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function appendChildren(pageId, blocks) {
    // Notion allows max 100 children per request
    for (let i = 0; i < blocks.length; i += 100) {
        const batch = blocks.slice(i, i + 100);
        await notionRequest(`/v1/blocks/${pageId}/children`, 'PATCH', { children: batch });
        if (i + 100 < blocks.length) {
            console.log(`  📦 Batch ${Math.floor(i / 100) + 1} enviado (${batch.length} bloques)...`);
        }
    }
}

// --- Main ---
async function main() {
    console.log("⏳ Leyendo datos enriquecidos...");
    const enrichedData = JSON.parse(
        fs.readFileSync('c:/Users/Pity/Desktop/Antigravity Skills/.tmp/enriched_documentation.json', 'utf8')
    );

    // 1. Build page properties
    const pageProps = {
        "Project Name": { title: [{ text: { content: enrichedData.project_name } }] },
        "Status": { select: { name: enrichedData.status || "🛠️ Dev" } },
        "Date": { date: { start: enrichedData.date || new Date().toISOString().split('T')[0] } },
        "Stack": { multi_select: (enrichedData.stack || []).map(s => ({ name: s })) },
        "Complexity": { select: { name: enrichedData.complexity || "⭐" } },
        "AI Insights": { rich_text: [{ text: { content: (enrichedData.ai_insights || '').substring(0, 1900) } }] }
    };

    // 2. Build header blocks (first 100, sent with page creation)
    const headerBlocks = [
        { object: 'block', type: 'table_of_contents', table_of_contents: { color: 'default' } },
        { object: 'block', type: 'divider', divider: {} },
        {
            object: 'block', type: 'callout', callout: {
                rich_text: [richText(enrichedData.summary || 'Sin resumen disponible.')],
                icon: { emoji: '🎯' }, color: 'blue_background'
            }
        },
        { object: 'block', type: 'divider', divider: {} }
    ];

    // 3. Build step blocks from enriched steps
    let stepBlocks = [];
    if (enrichedData.steps && enrichedData.steps.length > 0) {
        stepBlocks = buildBlocks(enrichedData.steps);
    }

    // 4. Footer
    const footerBlocks = [
        { object: 'block', type: 'divider', divider: {} },
        {
            object: 'block', type: 'callout', callout: {
                rich_text: [richText(`📄 Documentación generada automáticamente por documenting-projects skill | ${enrichedData.date || new Date().toISOString().split('T')[0]}`)],
                icon: { emoji: '🤖' }, color: 'gray_background'
            }
        }
    ];

    // 5. Create page with first batch of children (max 100)
    const allBlocks = [...headerBlocks, ...stepBlocks, ...footerBlocks];
    const firstBatch = allBlocks.slice(0, 100);
    const remainingBlocks = allBlocks.slice(100);

    console.log(`⏳ Creando página en Notion con ${allBlocks.length} bloques...`);

    try {
        const page = await notionRequest('/v1/pages', 'POST', {
            parent: { database_id: databaseId },
            properties: pageProps,
            children: firstBatch
        });

        console.log(`✅ Página creada: ${page.url}`);

        // 6. Append remaining blocks if any
        if (remainingBlocks.length > 0) {
            console.log(`⏳ Añadiendo ${remainingBlocks.length} bloques adicionales...`);
            await appendChildren(page.id, remainingBlocks);
        }

        console.log(`✅ ¡Documentación completa exportada a Notion! (${allBlocks.length} bloques)`);

        // Save page ID for reference
        fs.writeFileSync('c:/Users/Pity/Desktop/Antigravity Skills/.tmp/last_notion_page_id.txt', page.id);

    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    }
}

main();
