const fs = require('fs');
const https = require('https');

const envPath = 'c:/Users/Pity/Desktop/Antigravity Skills/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const notionTokenMatch = envContent.match(/NOTION_API_KEY=([^\s]+)/);
const dbIdMatch = envContent.match(/NOTION_DATABASE_ID=([^\s]+)/);

const notionToken = notionTokenMatch ? notionTokenMatch[1].trim() : null;
const databaseId = dbIdMatch ? dbIdMatch[1].trim() : null;

if (!notionToken || !databaseId) {
    console.error("❌ NOTION_API_KEY o NOTION_DATABASE_ID faltantes en .env");
    process.exit(1);
}

const enrichedData = JSON.parse(fs.readFileSync('c:/Users/Pity/Desktop/Antigravity Skills/.tmp/enriched_documentation.json', 'utf8'));

const data = JSON.stringify({
    parent: { database_id: databaseId },
    properties: {
        "Project Name": {
            title: [{ text: { content: enrichedData.project_name } }]
        },
        "Status": {
            select: { name: enrichedData.status }
        },
        "Date": {
            date: { start: enrichedData.date }
        },
        "Stack": {
            multi_select: enrichedData.stack.map(s => ({ name: s }))
        },
        "Complexity": {
            select: { name: enrichedData.complexity }
        },
        "AI Insights": {
            rich_text: [{ text: { content: enrichedData.ai_insights } }]
        }
    },
    children: [
        {
            object: 'block',
            type: 'heading_1',
            heading_1: { rich_text: [{ text: { content: enrichedData.project_name } }] }
        },
        {
            object: 'block',
            type: 'paragraph',
            paragraph: { rich_text: [{ text: { content: enrichedData.summary } }] }
        },
        {
            object: 'block',
            type: 'divider',
            divider: {}
        },
        {
            object: 'block',
            type: 'paragraph',
            paragraph: { rich_text: [{ text: { content: "Este es un reporte automático generado por la habilidad documenting-projects en Antigravity." } }] }
        }
    ]
});

const options = {
    hostname: 'api.notion.com',
    path: '/v1/pages',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
    }
};

console.log("⏳ Exportando datos a Notion...");

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("✅ Proyecto documentado en Notion con éxito!");
        } else {
            console.error(`❌ Error Notion ${res.statusCode}: ${body}`);
        }
    });
});
req.write(data);
req.end();
