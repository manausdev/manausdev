import { loadToken } from '../browser-mcp-lite/server/token.js';
import fs from 'fs';

async function run() {
  const token = loadToken();
  const URL = 'http://127.0.0.1:12307/mcp';
  let sessionId = null;

  async function post(body) {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': 'Bearer ' + token,
        ...(sessionId ? { 'mcp-session-id': sessionId } : {})
      },
      body: JSON.stringify(body)
    });
    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;
    const raw = await res.text();
    const lines = raw.split('\n').filter(l => l.startsWith('data:'));
    return lines.map(l => { try { return JSON.parse(l.slice(5)); } catch { return null; } }).filter(Boolean);
  }

  await post({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'agent', version: '1.0' } }
  });
  await post({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} });

  const tabsMsg = await post({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'list_tabs', arguments: {} }
  });
  const tabs = JSON.parse(tabsMsg.find(m => m.id === 2)?.result?.content?.[0]?.text || '[]');
  const targetTab = tabs.find(t => t.url.includes('manausdev-5c314.web.app'));

  if (targetTab) {
    const evalMsg = await post({
      jsonrpc: '2.0', id: 3, method: 'tools/call',
      params: {
        name: 'inject_script',
        arguments: {
          tabId: targetTab.id,
          code: 'JSON.stringify({ location: window.location.href, stylesheets: Array.from(document.styleSheets).map(s => s.href), scripts: Array.from(document.scripts).map(s => s.src), computedBg: window.getComputedStyle(document.body).backgroundColor, computedColor: window.getComputedStyle(document.body).color })'
        }
      }
    });
    console.log('Browser DOM State:', evalMsg.find(m => m.id === 3)?.result?.content?.[0]?.text);
  }
}

run().catch(console.error);
