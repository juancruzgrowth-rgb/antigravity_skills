const fs = require('fs');
const https = require('https');

const envPath = 'c:/Users/Pity/Desktop/Antigravity Skills/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const notionTokenMatch = envContent.match(/NOTION_API_KEY=([^\s]+)/);
const notionToken = notionTokenMatch ? notionTokenMatch[1].trim() : null;
const parentPageId = "31d0963847738091ae42e95885c3af9c";

console.log(`Debug: Token length: ${notionToken ? notionToken.length : 0}`);
// console.log(`Debug: Token start: ${notionToken ? notionToken.substring(0, 10) : 'none'}`);

if (!notionToken) {
    console.error("❌ NOTION_API_KEY no encontrada en .env");
    process.exit(1);
}

const data = JSON.stringify({
    parent: { type: "page_id", page_id: parentPageId },
    title: [
        {
            type: "text",
            text: { content: "📂 Registro de Proyectos Antigravity" }
        }
    ],
    properties: {
        "Project Name": { title: {} },
        "Status": {
            "select": {
                "options": [
                    { "name": "🛠️ Dev", "color": "orange" },
                    { "name": "✅ Done", "color": "green" },
                    { "name": "🚀 Published", "color": "blue" }
                ]
            }
        },
        "Date": { "date": {} },
        "Stack": {
            "multi_select": {
                "options": [
                    { "name": "Antigravity", "color": "purple" },
                    { "name": "n8n", "color": "red" },
                    { "name": "Supabase", "color": "green" },
                    { "name": "Notion", "color": "default" },
                    { "name": "Python", "color": "blue" }
                ]
            }
        },
        "Complexity": {
            "select": {
                "options": [
                    { "name": "⭐", "color": "yellow" },
                    { "name": "⭐⭐", "color": "orange" },
                    { "name": "⭐⭐⭐", "color": "red" }
                ]
            }
        },
        "AI Insights": { "rich_text": {} }
    }
});

const options = {
    hostname: 'api.notion.com',
    path: '/v1/databases',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
    }
};

console.log("⏳ Creando base de datos en Notion via Node.js...");

const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const db = JSON.parse(responseBody);
            console.log(`✅ Base de Datos creada con éxito!`);
            console.log(`ID: ${db.id}`);
            console.log(`URL: ${db.url}`);
            fs.appendFileSync('c:/Users/Pity/Desktop/Antigravity Skills/.env', `\nNOTION_DATABASE_ID=${db.id}\n`);
            console.log("✅ NOTION_DATABASE_ID guardado en .env");
        } else {
            console.error(`❌ Error ${res.statusCode}: ${responseBody}`);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Error de red: ${e.message}`);
});

req.write(data);
req.end();
