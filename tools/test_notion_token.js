const fs = require('fs');
const https = require('https');

const envPath = 'c:/Users/Pity/Desktop/Antigravity Skills/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const notionTokenMatch = envContent.match(/NOTION_API_KEY=([^\s]+)/);
const notionToken = notionTokenMatch ? notionTokenMatch[1].trim() : null;

if (!notionToken) {
    console.error("❌ NOTION_API_KEY no encontrada");
    process.exit(1);
}

const options = {
    hostname: 'api.notion.com',
    path: '/v1/users/me',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28'
    }
};

console.log("⏳ Verificando token con /v1/users/me...");

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${body}`);
    });
});

req.on('error', (e) => console.error(e));
req.end();
