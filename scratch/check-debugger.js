// Dependency-free script using Node's native WebSocket and fetch APIs to communicate with Chrome DevTools Protocol
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  // 1. Create a new tab using PUT method (required by newer Chrome versions)
  const createTabRes = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
  const tabInfo = await createTabRes.json();
  const wsUrl = tabInfo.webSocketDebuggerUrl;
  console.log(`Created new tab. WebSocket URL: ${wsUrl}`);

  // 2. Connect to the tab's WebSocket
  const ws = new globalThis.WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('Connected to CDP WebSocket');
    // Enable Runtime for console messages
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    // Enable Log for general logs
    ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
    // Enable Page for navigation
    ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
    // Navigate to the local server
    console.log('Navigating to http://localhost:3000...');
    ws.send(JSON.stringify({
      id: 4,
      method: 'Page.navigate',
      params: { url: 'http://localhost:3000' }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data.toString());

    // Console logs
    if (data.method === 'Runtime.consoleAPICalled') {
      const type = data.params.type.toUpperCase();
      const args = data.params.args.map(arg => arg.value || JSON.stringify(arg)).join(' ');
      console.log(`[BROWSER CONSOLE ${type}] ${args}`);
    }

    // Exceptions
    if (data.method === 'Runtime.exceptionThrown') {
      const details = data.params.exceptionDetails;
      console.error(`[BROWSER EXCEPTION] ${details.exception ? details.exception.description : details.text}`);
    }

    // Log entries
    if (data.method === 'Log.entryAdded') {
      console.log(`[BROWSER LOG] [${data.params.entry.level.toUpperCase()}] ${data.params.entry.text}`);
    }
  };

  ws.onerror = (err) => {
    console.error('CDP WebSocket error:', err);
  };

  ws.onclose = () => {
    console.log('CDP WebSocket closed');
  };

  // Keep open for 4 seconds
  await sleep(4000);
  console.log('Closing tab...');
  
  // Close the tab
  await fetch(`http://localhost:9222/json/close/${tabInfo.id}`, { method: 'DELETE' }); // Usually close supports any method, but let's just make it PUT/DELETE if needed, or default
  console.log('Done!');
}

main().catch(console.error);
