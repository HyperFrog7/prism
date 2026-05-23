import * as BareMux from "https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.7/dist/index.mjs";
        window.BareMux = BareMux;

// ── Theme sync from parent ──────────────
                window.addEventListener('message', (e) => {
                    if (e.data && e.data.type === 'GHOSTLINK_NT_THEME') {
                        const t = e.data.theme;
                        const r = document.documentElement;
                        if (t.bg) r.style.setProperty('--bg', t.bg);
                        if (t.accent) r.style.setProperty('--accent', t.accent);
                        if (t.accentGlow) r.style.setProperty('--accent-glow', t.accentGlow);
                        if (t.textPrimary) r.style.setProperty('--text-primary', t.textPrimary);
                        if (t.textDim) r.style.setProperty('--text-dim', t.textDim);
                        if (t.border) r.style.setProperty('--border', t.border);
                        if (t.cardBg) r.style.setProperty('--card-bg', t.cardBg);
                        if (t.inputBg) r.style.setProperty('--input-bg', t.inputBg);
                        if (t.font) r.style.setProperty('--font', t.font);
                        if (t.bgImage) r.style.setProperty('--bg-image', t.bgImage);
                        if (t.bgBlur) r.style.setProperty('--bg-blur', t.bgBlur);
                        if (t.bgBrightness) r.style.setProperty('--bg-brightness', t.bgBrightness);
                        document.body.style.backgroundColor = t.bg || '';
                    }
                });
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'GHOSTLINK_NT_READY' }, '*');
                }

                // ── Nav pill buttons ─────────────────────
                function ntNavigate(url) {
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'navigate', url }, '*');
                    } else {
                        document.getElementById('loader').classList.add('show');
                        window.location.href = url;
                    }
                }

                function ntSignal(action) {
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'prism-action', action }, '*');
                    }
                }

                document.getElementById('nt-browse').onclick = () => ntSignal('browse');
                document.getElementById('nt-games').onclick  = () => ntSignal('games');
                document.getElementById('nt-settings').onclick = () => ntSignal('settings');

                // ── Search ───────────────────────────────
                (function () {
                    const saved = localStorage.getItem('gl_search_engine');
                    const sel = document.getElementById('engine');
                    if (saved) { const opt = [...sel.options].find(o => o.value === saved); if (opt) sel.value = saved; }
                    sel.addEventListener('change', () => localStorage.setItem('gl_search_engine', sel.value));
                })();
                document.getElementById('searchForm').onsubmit = e => {
                    e.preventDefault();
                    const q = document.getElementById('searchInput').value.trim();
                    if (!q) return;
                    const engine = document.getElementById('engine').value;
                    const isUrl = /^https?:\/\//.test(q) || (/\./.test(q) && !/ /.test(q));
                    ntNavigate(isUrl ? (/^https?:\/\//.test(q) ? q : 'https://' + q) : engine + encodeURIComponent(q));
                };

                // ── Shortcuts ────────────────────────────
                const DEFAULT_SHORTCUTS = [
                    { label: 'YouTube',   url: 'https://youtube.com',   viewBox: '0 0 16 16', svg: '<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>' },
                    { label: 'GitHub',    url: 'https://github.com',    viewBox: '0 0 24 24', svg: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>' },
                    { label: 'Discord',   url: 'https://discord.com',   viewBox: '0 0 24 24', svg: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>' },
                    { label: 'Reddit',    url: 'https://reddit.com',    viewBox: '0 0 16 16', svg: '<path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/>' },
                    { label: 'Twitter',   url: 'https://twitter.com',   viewBox: '0 0 24 24', svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
                    { label: 'Instagram', url: 'https://instagram.com', viewBox: '0 0 16 16', svg: '<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.919c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>' },
                ];
                function getShortcuts() {
                    try { return JSON.parse(localStorage.getItem('gl_shortcuts') || 'null') || DEFAULT_SHORTCUTS; }
                    catch { return DEFAULT_SHORTCUTS; }
                }
                function saveShortcuts(list) { localStorage.setItem('gl_shortcuts', JSON.stringify(list)); }
                function renderShortcuts() {
                    const container = document.getElementById('shortcuts');
                    container.innerHTML = '';
                    getShortcuts().forEach((s, i) => {
                        const el = document.createElement('div');
                        el.className = 'shortcut';
                        el.style.animationDelay = (i * 0.04 + 0.04) + 's';
                        const iconHtml = s.svg
                            ? `<svg viewBox="${s.viewBox || '0 0 24 24'}" fill="currentColor" stroke="none" class="shortcut-svg">${s.svg}</svg>`
                            : `<img src="${s.icon}" onerror="this.style.display='none'">`;
                        el.innerHTML = `<div class="shortcut-icon">${iconHtml}</div><span class="shortcut-label">${s.label}</span>`;
                        el.onclick = () => ntNavigate(s.url);
                        container.appendChild(el);
                    });
                }
                renderShortcuts();
                const closeModal = () => document.getElementById('addModal').classList.add('hidden');
                document.getElementById('cancelAdd').onclick = closeModal;
                document.getElementById('cancelAdd2').onclick = closeModal;
                document.getElementById('addModal').onclick = e => { if (e.target === document.getElementById('addModal')) closeModal(); };
                document.getElementById('confirmAdd').onclick = () => {
                    const label = document.getElementById('newLabel').value.trim();
                    let url = document.getElementById('newUrl').value.trim();
                    if (!label || !url) return;
                    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
                    const icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
                    const list = getShortcuts(); list.push({ label, url, icon }); saveShortcuts(list);
                    closeModal(); document.getElementById('newLabel').value = ''; document.getElementById('newUrl').value = '';
                    renderShortcuts();
                };

(function () {
                    const input = document.getElementById('searchInput');
                    if (!input) return;
                    const caret = document.createElement('div');
                    caret.className = 'fake-caret';
                    input.parentElement.appendChild(caret);
                    const cvs = document.createElement('canvas');
                    function update() {
                        if (document.activeElement !== input) { caret.style.display = 'none'; return; }
                        const val = input.value.substring(0, input.selectionStart ?? input.value.length);
                        const cs = getComputedStyle(input); const ctx = cvs.getContext('2d'); ctx.font = cs.font;
                        const tw = ctx.measureText(val).width;
                        const boxLeft = input.parentElement.getBoundingClientRect().left;
                        const inputLeft = input.getBoundingClientRect().left;
                        const caretX = inputLeft - boxLeft + tw;
                        const boxWidth = input.parentElement.getBoundingClientRect().width;
                        if (caretX >= boxWidth - 4) { caret.style.display = 'none'; return; }
                        caret.style.left = caretX + 'px'; caret.style.display = 'block';
                    }
                    ['focus','input','keyup','click','select'].forEach(ev => input.addEventListener(ev, update));
                    input.addEventListener('keydown', () => requestAnimationFrame(update));
                    input.addEventListener('blur', () => { caret.style.display = 'none'; });
                })();

function sendThemeToIframe() {
            const iframe = document.getElementById('app-frame');
            if (!iframe || !iframe.contentWindow) return;

            const styles = getComputedStyle(document.documentElement);
            const theme = {
                accent: styles.getPropertyValue('--accent').trim(),
                bg: styles.getPropertyValue('--bg').trim(),
                font: styles.getPropertyValue('--font').trim()
            };

            iframe.contentWindow.postMessage({
                type: 'GHOSTLINK_THEME_DATA',
                theme: theme
            }, '*');
        }

        function sendThemeToNtTabs() {
            if (typeof tabs === 'undefined' || !tabs.length) return;
            const s = getComputedStyle(document.documentElement);
            const g = (v) => s.getPropertyValue(v).trim();
            const theme = {
                bg: g('--bg'),
                accent: g('--accent'),
                accentGlow: g('--accent-glow'),
                textPrimary: g('--text-primary'),
                textDim: g('--text-dim'),
                border: g('--border'),
                cardBg: g('--card-bg'),
                inputBg: g('--input-bg'),
                font: g('--font'),
                bgImage: g('--bg-image'),
                bgBlur: g('--bg-blur'),
                bgBrightness: g('--bg-brightness'),
            };
            tabs.forEach(tab => {
                const isNt = !tab.url || tab.url === 'NT.html' || (tab.url && tab.url.startsWith('blob:'));
                if (isNt && tab.frame && tab.frame.frame && tab.frame.frame.contentWindow) {
                    try { tab.frame.frame.contentWindow.postMessage({ type: 'GHOSTLINK_NT_THEME', theme }, '*'); } catch (e) { }
                }
            });
        }

        window.addEventListener('message', (event) => {
            if (event.data.type === 'GHOSTLINK_QUERY_THEME') {
                sendThemeToIframe();
            }
            if (event.data.type === 'GHOSTLINK_NT_READY') {
                sendThemeToNtTabs();
            }
        });

        let proxyBrowserInitialized = false;
        let WISP_SERVERS = [];
        let DEFAULT_WISP = window.SITE_CONFIG?.defaultWisp ?? null;

        async function fetchWispServers() {
            try {
                const res = await fetch(" ");
                const text = await res.text();
                const match = text.match(/const\s+WISP_SERVERS\s*=\s*(\[[\s\S]*?\]);/);
                if (match) {
                    WISP_SERVERS = (new Function('return ' + match[1]))();
                }
            } catch (e) {
                console.warn("Failed to fetch wisp server list:", e);
            }
            if (!WISP_SERVERS.length) {
                WISP_SERVERS = [{ name: "Wisp 1", url: "wss://wisp.rhw.one/wisp/" }];
            }
            if (!DEFAULT_WISP) DEFAULT_WISP = WISP_SERVERS[0].url;
            if (!localStorage.getItem("proxServer")) {
                localStorage.setItem("proxServer", DEFAULT_WISP);
            }
        }

        function getAllWispServers() {
            const customWisps = getStoredWisps();
            return [...WISP_SERVERS, ...customWisps];
        }


        async function pingWispServer(url, timeout = 2000) {
            return new Promise((resolve) => {
                const start = Date.now();
                try {
                    const ws = new WebSocket(url);
                    const timer = setTimeout(() => {
                        try { ws.close(); } catch { }
                        resolve({ url, success: false, latency: null });
                    }, timeout);

                    ws.onopen = () => {
                        clearTimeout(timer);
                        const latency = Date.now() - start;
                        try { ws.close(); } catch { }
                        resolve({ url, success: true, latency });
                    };

                    ws.onerror = () => {
                        clearTimeout(timer);
                        try { ws.close(); } catch { }
                        resolve({ url, success: false, latency: null });
                    };
                } catch {
                    resolve({ url, success: false, latency: null });
                }
            });
        }

        async function findBestWispServer(servers, currentUrl) {
            if (!servers || servers.length === 0) return currentUrl;

            const results = await Promise.all(
                servers.map(s => pingWispServer(s.url, 2000))
            );
            const working = results
                .filter(r => r.success)
                .sort((a, b) => a.latency - b.latency);

            if (working.length > 0) {
                return working[0].url;
            }
            return currentUrl || servers[0]?.url;
        }

        async function initializeWithBestServer() {
            const autoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
            const allServers = getAllWispServers();

            if (!autoswitch || allServers.length <= 1) {
                return;
            }

            const currentUrl = localStorage.getItem("proxServer") || DEFAULT_WISP;

            const currentCheck = await pingWispServer(currentUrl, 2000);

            if (currentCheck.success) {
                console.log("Init: Current server is working:", currentUrl, currentCheck.latency + "ms");
                return;
            }

            console.log("Init: Current server not responding, finding better server...");
            const best = await findBestWispServer(allServers, currentUrl);

            if (best && best !== currentUrl) {
                console.log("Init: Auto-switching to faster server:", best);
                localStorage.setItem("proxServer", best);
                const serverName = allServers.find(s => s.url === best)?.name || 'Faster Server';
                proxyNotify('info', 'Auto-switched', `Using ${serverName} for best performance`);
            }
        }


        const getBareMux = () => window.BareMux ?? null;

        let sharedScramjet = null;
        let sharedConnection = null;
        let sharedConnectionReady = false;

        let tabs = [];
        let activeTabId = null;
        let nextTabId = 1;


        const getBasePath = () => {
            const basePath = location.pathname.replace(/[^/]*$/, '');
            return basePath.endsWith('/') ? basePath : basePath + '/';
        };

        const getStoredWisps = () => {
            try { return JSON.parse(localStorage.getItem('customWisps') ?? '[]'); }
            catch { return []; }
        };

        const getActiveTab = () => tabs.find(t => t.id === activeTabId);

        const proxyNotify = (type, title, message) => {
            if (typeof Notify !== 'undefined') {
                Notify[type](title, message);
            }
        };


        async function getSharedScramjet() {
            if (sharedScramjet) return sharedScramjet;

            if (typeof $scramjetLoadController === 'undefined') {
                throw new Error("Scramjet not loaded. The CDN script may have failed to load.");
            }

            const basePath = getBasePath();
            const { ScramjetController } = $scramjetLoadController();

            sharedScramjet = new ScramjetController({
                prefix: basePath + "scramjet/",
                files: {
                    wasm: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.wasm.wasm",
                    all: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.all.js",
                    sync: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.sync.js"
                }
            });

            try {
                await sharedScramjet.init();
            } catch (err) {
                if (err.message && err.message.includes('IDBDatabase') || err.message && err.message.includes('object stores')) {
                    console.warn('Scramjet IndexedDB error, clearing cache and retrying...');

                    try {
                        const dbNames = ['scramjet-data', 'scrambase', 'ScramjetData'];
                        for (const dbName of dbNames) {
                            const req = indexedDB.deleteDatabase(dbName);
                            req.onsuccess = () => console.log(`Cleared IndexedDB: ${dbName}`);
                            req.onerror = () => console.warn(`Failed to clear IndexedDB: ${dbName}`);
                        }
                    } catch (clearErr) {
                        console.warn('Failed to clear IndexedDB:', clearErr);
                    }

                    sharedScramjet = null;
                    return getSharedScramjet();
                }
                throw err;
            }

            return sharedScramjet;
        }

        async function getSharedConnection() {
            if (sharedConnectionReady) return sharedConnection;

            const wispUrl = localStorage.getItem("proxServer") ?? DEFAULT_WISP;

            const BM = getBareMux();
            if (!BM) throw new Error("BareMux not loaded yet. The bare-mux module import may have failed.");

            sharedConnection = new BM.BareMuxConnection(getBasePath() + "bareworker.js");
            await sharedConnection.setTransport(
                "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@2.1.3/dist/index.mjs",
                [{ wisp: wispUrl }]
            );
            sharedConnectionReady = true;
            return sharedConnection;
        }

        function initFakeCaret(input) {
            const wrapper = input.parentElement;
            const caret = document.createElement('div');
            caret.className = 'fake-caret';
            caret.style.height = '0.9rem';
            wrapper.appendChild(caret);
            const cvs = document.createElement('canvas');
            function update() {
                if (document.activeElement !== input) { caret.style.display = 'none'; return; }
                const val = input.value.substring(0, input.selectionStart ?? input.value.length);
                const cs = getComputedStyle(input);
                const ctx = cvs.getContext('2d');
                ctx.font = cs.font;
                const tw = ctx.measureText(val).width;
                caret.style.left = ((parseFloat(cs.paddingLeft) || 0) + tw) + 'px';
                caret.style.display = 'block';
            }
            ['focus', 'input', 'keyup', 'click', 'select'].forEach(ev => input.addEventListener(ev, update));
            input.addEventListener('keydown', () => requestAnimationFrame(update));
            input.addEventListener('blur', () => { caret.style.display = 'none'; });
        }

        async function initializeBrowser() {
            const root = document.getElementById("proxy-app");
            root.innerHTML = `
                <div class="browser-container">
                    <div class="browser-tabs" id="tabs-container"></div>
                    <div class="proxy-nav">
                        <button id="back-btn" title="Back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <button id="fwd-btn" title="Forward"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
                        <button id="reload-btn" title="Reload"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
                        <div class="address-wrapper">
                            <input class="bar" id="address-bar" autocomplete="off" placeholder="Search or enter URL">
                            <button id="home-btn-nav" title="Home"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></button>
                        </div>
                        <button id="devtools-btn" title="DevTools"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></button>
                        <button id="wisp-settings-btn" title="Proxy Settings"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
                    </div>
                    <div class="loading-bar-container"><div class="loading-bar" id="loading-bar"></div></div>
                    <div class="iframe-container" id="iframe-container">
                        <div id="loading" class="message-container" style="display: none;">
                            <div class="message-content">
                                <div class="spinner"></div>
                                <h1 id="loading-title">Connecting</h1>
                                <p id="loading-url">Initializing proxy...</p>
                                <button id="skip-btn">Skip</button>
                            </div>
                        </div>
                        <div id="error" class="message-container" style="display: none;">
                            <div class="message-content">
                                <h1>Connection Error</h1>
                                <p id="error-message">An error occurred.</p>
                            </div>
                        </div>
                    </div>
                </div>`;

            const elements = {
                backBtn: document.getElementById('back-btn'),
                fwdBtn: document.getElementById('fwd-btn'),
                reloadBtn: document.getElementById('reload-btn'),
                addrBar: document.getElementById('address-bar'),
                skipBtn: document.getElementById('skip-btn')
            };
            initFakeCaret(elements.addrBar);

            elements.backBtn.onclick = () => {
                const tab = getActiveTab();
                if (!tab || tab.historyIndex <= 0) return;
                tab._navigating = true;
                tab.historyIndex--;
                const target = tab.historyStack[tab.historyIndex];
                if (target === 'newtab') {
                    tab.frame.frame.src = window.__ntBlobURL;
                    tab.title = "New Tab";
                    tab.url = "";
                    tab.favicon = null;
                    updateTabsUI();
                    updateAddressBar();
                } else {
                    tab.frame.go(target);
                }
                setTimeout(() => { tab._navigating = false; }, 500);
            };
            elements.fwdBtn.onclick = () => {
                const tab = getActiveTab();
                if (!tab || tab.historyIndex >= tab.historyStack.length - 1) return;
                tab._navigating = true;
                tab.historyIndex++;
                const target = tab.historyStack[tab.historyIndex];
                if (target === 'newtab') {
                    tab.frame.frame.src = window.__ntBlobURL;
                    tab.title = "New Tab";
                    tab.url = "";
                    tab.favicon = null;
                    updateTabsUI();
                    updateAddressBar();
                } else {
                    tab.frame.go(target);
                }
                setTimeout(() => { tab._navigating = false; }, 500);
            };
            elements.reloadBtn.onclick = () => getActiveTab()?.frame.reload();
            document.getElementById('home-btn-nav').onclick = () => {
                const tab = getActiveTab();
                if (tab) {
                    tab.frame.frame.src = window.__ntBlobURL;
                    tab.title = "New Tab";
                    tab.url = "";
                    tab.favicon = null;
                    updateTabsUI();
                    updateAddressBar();
                }
            };
            document.getElementById('devtools-btn').onclick = toggleDevTools;
            document.getElementById('wisp-settings-btn').onclick = openSettings;

            elements.skipBtn.onclick = () => {
                const tab = getActiveTab();
                if (tab) {
                    tab.loading = false;
                    showIframeLoading(false);
                }
            };

            elements.addrBar.onkeyup = (e) => e.key === 'Enter' && handleSubmit();
            elements.addrBar.onfocus = () => elements.addrBar.select();

            window.addEventListener('message', (e) => {
                if (e.data?.type === 'navigate') handleSubmit(e.data.url);
                if (e.data?.type === 'gl_open_tab' && e.data.url) {
                    createTab(true);
                    handleSubmit(e.data.url);
                }
                if (e.data?.type === 'prism-action') {
                    const action = e.data.action;
                    if (action === 'browse') {
                        window.__showBrowserChrome?.();
                        document.getElementById('address-bar')?.focus();
                    } else if (action === 'settings') {
                        openPrismSettings();
                    } else if (action === 'games') {
                        window.__showBrowserChrome?.();
                        createTab(true);
                        handleSubmit('https://www.crazygames.com');
                    }
                }
            });

            createTab(true);
            checkHashParameters();

            // Hide the browser chrome on first load — show the NT home full-screen
            const browserContainer = document.querySelector('.browser-container');
            const tabsRow = document.getElementById('tabs-container');
            const navRow = document.querySelector('.proxy-nav');
            const loadingBarRow = document.querySelector('.loading-bar-container');

            function showBrowserChrome() {
                if (tabsRow) tabsRow.style.display = '';
                if (navRow) navRow.style.display = '';
                if (loadingBarRow) loadingBarRow.style.display = '';
                window.__prismChromeVisible = true;
            }

            function hideBrowserChrome() {
                if (tabsRow) tabsRow.style.display = 'none';
                if (navRow) navRow.style.display = 'none';
                if (loadingBarRow) loadingBarRow.style.display = 'none';
                window.__prismChromeVisible = false;
            }

            // Start hidden — home page IS the new tab
            hideBrowserChrome();
            window.__showBrowserChrome = showBrowserChrome;
            window.__hideBrowserChrome = hideBrowserChrome;

            window.addEventListener('resize', () => {
                if (tabs.length > 0) updateTabsUI();
            });
        }


        function canAddTab() {
            return tabs.length < 12;
        }
        function createTab(makeActive = true) {
            if (!canAddTab()) return;
            const frame = sharedScramjet.createFrame();
            const tab = {
                id: nextTabId++,
                title: "New Tab",
                url: "NT.html",
                frame,
                loading: false,
                favicon: null,
                skipTimeout: null,
                loadStartTime: null,
                historyStack: ['newtab'],
                historyIndex: 0,
                _navigating: false
            };

            frame.frame.src = window.__ntBlobURL;

            frame.addEventListener("urlchange", (e) => {
                tab.url = e.url;

                if (!tab._navigating) {
                    tab.historyStack = tab.historyStack.slice(0, tab.historyIndex + 1);
                    tab.historyStack.push(e.url);
                    tab.historyIndex = tab.historyStack.length - 1;
                }

                tab.loading = true;
                tab.loadStartTime = Date.now();

                if (tab.id === activeTabId) {
                    showIframeLoading(true, tab.url);
                }

                try {
                    const urlObj = new URL(e.url);
                    tab.title = urlObj.hostname;
                    tab.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
                } catch {
                    tab.title = "Browsing";
                    tab.favicon = null;
                }

                updateTabsUI();
                updateAddressBar();
                updateLoadingBar(tab, 10);

                if (tab.skipTimeout) clearTimeout(tab.skipTimeout);
                tab.skipTimeout = setTimeout(() => {
                    if (tab.loading && tab.id === activeTabId) {
                        document.getElementById('skip-btn')?.style.setProperty('display', 'inline-block');
                    }
                }, 200);

                if (tab.loadFallbackTimeout) clearTimeout(tab.loadFallbackTimeout);
                tab.loadFallbackTimeout = setTimeout(() => {
                    if (tab.loading) {
                        tab.loading = false;
                        clearTimeout(tab.skipTimeout);
                        if (tab.id === activeTabId) showIframeLoading(false);
                        updateTabsUI();
                        updateLoadingBar(tab, 100);
                    }
                }, 2000);
            });

            frame.frame.addEventListener('load', () => {
                tab.loading = false;
                clearTimeout(tab.skipTimeout);
                clearTimeout(tab.loadFallbackTimeout);

                if (tab.id === activeTabId) {
                    showIframeLoading(false);
                }

                try {
                    const cw = frame.frame.contentWindow;
                    if (cw && cw.open !== cw.__glPatched) {
                        const _origOpen = cw.open.bind(cw);
                        cw.open = function (url, target, features) {
                            if (url && url !== 'about:blank' && url !== '' && typeof url === 'string') {
                                // Post to parent GhostLink to open as a new proxy tab
                                window.postMessage({ type: 'gl_open_tab', url: url }, '*');
                                return null;
                            }
                            return _origOpen(url, target, features);
                        };
                        cw.open.__glPatched = true;
                    }
                } catch (e) { /* cross-origin frame, scramjet handles it */ }

                try {
                    const title = frame.frame.contentWindow.document.title;
                    if (title) tab.title = title;
                } catch { }

                const href = frame.frame.contentWindow?.location?.href || '';
                if (href === window.__ntBlobURL || href.includes('NT.html')) {
                    tab.title = "New Tab";
                    tab.url = "";
                    tab.favicon = null;
                }

                updateTabsUI();
                updateAddressBar();
                updateLoadingBar(tab, 100);
            });

            tabs.push(tab);
            frame.frame.setAttribute('referrerpolicy', 'no-referrer');
            document.getElementById("iframe-container").appendChild(frame.frame);
            if (makeActive) switchTab(tab.id);
            return tab;
        }

        function showIframeLoading(show, url = '') {
            const loader = document.getElementById("loading");
            if (!loader) return;

            loader.style.display = show ? "flex" : "none";
            getActiveTab()?.frame.frame.classList.toggle('loading', show);

            if (show) {
                document.getElementById("loading-title").textContent = "Connecting";
                document.getElementById("loading-url").textContent = url || "Loading content...";
                document.getElementById("skip-btn").style.display = 'none';
            }
        }

        function switchTab(tabId) {
            activeTabId = tabId;
            const tab = getActiveTab();

            tabs.forEach(t => t.frame.frame.classList.toggle("hidden", t.id !== tabId));

            if (tab) {
                showIframeLoading(tab.loading, tab.url);

                const skipBtn = document.getElementById('skip-btn');
                if (tab.loading && tab.loadStartTime && skipBtn) {
                    const elapsed = Date.now() - tab.loadStartTime;
                    if (elapsed > 3000) skipBtn.style.display = 'inline-block';
                }
            }

            updateTabsUI();
            updateAddressBar();
        }

        function closeTab(tabId) {
            const idx = tabs.findIndex(t => t.id === tabId);
            if (idx === -1) return;

            const tab = tabs[idx];
            clearTimeout(tab.skipTimeout);
            clearTimeout(tab.loadFallbackTimeout);

            if (tab.frame?.frame) {
                tab.frame.frame.src = 'about:blank';
                tab.frame.frame.remove();
            }

            tabs.splice(idx, 1);

            if (activeTabId === tabId) {
                if (tabs.length > 0) switchTab(tabs[Math.max(0, idx - 1)].id);
                else window.location.reload();
            } else {
                updateTabsUI();
            }
        }

        let _dragSrcTabId = null;

        function updateTabsUI() {
            const container = document.getElementById("tabs-container");
            if (!container) return;
            container.innerHTML = "";

            tabs.forEach(tab => {
                const el = document.createElement("div");
                el.className = `tab ${tab.id === activeTabId ? "active" : ""}`;
                el.draggable = true;
                el.dataset.tabId = tab.id;

                const iconHtml = tab.loading
                    ? `<div class="tab-spinner"></div>`
                    : tab.favicon
                        ? `<img src="${tab.favicon}" class="tab-favicon" onerror="this.style.display='none'">`
                        : '';

                el.innerHTML = `${iconHtml}<span class="tab-title">${tab.title}</span><span class="tab-close">&times;</span>`;
                el.onclick = () => switchTab(tab.id);
                el.querySelector(".tab-close").onclick = (e) => { e.stopPropagation(); closeTab(tab.id); };

                el.addEventListener("dragstart", (e) => {
                    _dragSrcTabId = tab.id;
                    e.dataTransfer.effectAllowed = "move";
                    setTimeout(() => el.style.opacity = "0.4", 0);
                });
                el.addEventListener("dragend", () => {
                    el.style.opacity = "";
                    container.querySelectorAll(".tab").forEach(t => t.classList.remove("drag-over"));
                });
                el.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (tab.id !== _dragSrcTabId) el.classList.add("drag-over");
                });
                el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
                el.addEventListener("drop", (e) => {
                    e.preventDefault();
                    el.classList.remove("drag-over");
                    if (_dragSrcTabId === null || _dragSrcTabId === tab.id) return;
                    const fromIdx = tabs.findIndex(t => t.id === _dragSrcTabId);
                    const toIdx = tabs.findIndex(t => t.id === tab.id);
                    if (fromIdx === -1 || toIdx === -1) return;
                    const [moved] = tabs.splice(fromIdx, 1);
                    tabs.splice(toIdx, 0, moved);
                    _dragSrcTabId = null;
                    updateTabsUI();
                });

                container.appendChild(el);
            });


            const newBtn = document.createElement("button");
            newBtn.className = "new-tab";
            newBtn.innerHTML = "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>";

            newBtn.id = "new-tab-btn";
            newBtn.onclick = () => createTab(true);
            container.appendChild(newBtn);

            newBtn.disabled = !canAddTab();
        }

        function updateAddressBar() {
            const bar = document.getElementById("address-bar");
            const tab = getActiveTab();
            if (bar && tab) {
                bar.value = (tab.url && !tab.url.includes("NT.html") && tab.url !== window.__ntBlobURL) ? tab.url : "";
            }
        }

        function handleSubmit(url) {
            const tab = getActiveTab();
            let input = url ?? document.getElementById("address-bar").value.trim();
            if (!input) return;

            if (!input.startsWith('http')) {
                const savedEngine = localStorage.getItem('gl_search_engine') || 'https://duckduckgo.com/?q=';
                input = input.includes('.') && !input.includes(' ')
                    ? `https://${input}`
                    : `${savedEngine}${encodeURIComponent(input)}`;
            }

            tab.loading = true;
            showIframeLoading(true, input);
            updateLoadingBar(tab, 10);
            tab.frame.go(input);
        }

        function updateLoadingBar(tab, percent) {
            if (tab.id !== activeTabId) return;
            const bar = document.getElementById("loading-bar");
            bar.style.width = percent + "%";
            bar.style.opacity = percent === 100 ? "0" : "1";
            if (percent === 100) setTimeout(() => { bar.style.width = "0%"; }, 200);
        }


        function openSettings() {
            const modal = document.getElementById('wisp-settings-modal');
            modal.classList.remove('hidden');

            document.getElementById('close-wisp-modal').onclick = () => modal.classList.add('hidden');
            document.getElementById('save-custom-wisp').onclick = saveCustomWisp;
            modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

            renderServerList();
        }

        function renderServerList() {
            const list = document.getElementById('server-list');
            list.innerHTML = '';

            const currentUrl = localStorage.getItem('proxServer') ?? DEFAULT_WISP;
            const allWisps = [...WISP_SERVERS, ...getStoredWisps()];

            allWisps.forEach((server, index) => {
                const isActive = server.url === currentUrl;
                const isCustom = index >= WISP_SERVERS.length;

                const item = document.createElement('div');
                item.className = `wisp-option ${isActive ? 'active' : ''}`;

                const deleteBtn = isCustom
                    ? `<button class="delete-wisp-btn" onclick="event.stopPropagation(); deleteCustomWisp('${server.url}')"><i class="fa-solid fa-trash"></i></button>`
                    : '';

                item.innerHTML = `
                    <div class="wisp-option-header">
                        <div class="wisp-option-name">
                            ${server.name}
                            ${isActive ? '<i class="fa-solid fa-check" style="margin-left:8px; font-size: 0.85em; color: var(--accent);"></i>' : ''}
                        </div>
                        <div class="server-status">
                            <span class="ping-text">...</span>
                            <div class="status-indicator"></div>
                            ${deleteBtn}
                        </div>
                    </div>
                    <div class="wisp-option-url">${server.url}</div>
                `;

                item.onclick = () => setWisp(server.url);
                list.appendChild(item);
                checkServerHealth(server.url, item);
            });

            const isAutoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'wisp-option';
            toggleContainer.style.cssText = 'margin-top: 10px; cursor: default;';
            toggleContainer.innerHTML = `
                <div class="wisp-option-header" style="justify-content: space-between;">
                    <div class="wisp-option-name"><i class="fa-solid fa-rotate" style="margin-right:8px"></i> Auto-switch on failure</div>
                    <div class="toggle-switch ${isAutoswitch ? 'active' : ''}" id="autoswitch-toggle">
                        <div class="toggle-knob"></div>
                    </div>
                </div>
            `;

            toggleContainer.onclick = () => {
                const newState = !isAutoswitch;
                localStorage.setItem('wispAutoswitch', newState);
                document.getElementById('autoswitch-toggle').classList.toggle('active', newState);

                navigator.serviceWorker.controller?.postMessage({ type: 'config', autoswitch: newState });
                proxyNotify('success', 'Settings Saved', `Autoswitch ${newState ? 'Enabled' : 'Disabled'}`);
                location.reload();
            };

            list.appendChild(toggleContainer);
        }

        function saveCustomWisp() {
            const input = document.getElementById('custom-wisp-input');
            const url = input.value.trim();

            if (!url) return;
            if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
                proxyNotify('error', 'Invalid URL', 'URL must start with wss:// or ws://');
                return;
            }

            const customWisps = getStoredWisps();
            if (customWisps.some(w => w.url === url) || WISP_SERVERS.some(w => w.url === url)) {
                proxyNotify('warning', 'Already Exists', 'This server is already in the list.');
                return;
            }

            const newServer = { name: `Custom ${customWisps.length + 1}`, url };
            customWisps.push(newServer);
            localStorage.setItem('customWisps', JSON.stringify(customWisps));

            setWisp(url);

            input.value = '';
        }

        window.deleteCustomWisp = function (urlToDelete) {
            if (!confirm("Remove this server?")) return;

            let customWisps = getStoredWisps().filter(w => w.url !== urlToDelete);
            localStorage.setItem('customWisps', JSON.stringify(customWisps));

            if (localStorage.getItem('proxServer') === urlToDelete) {
                setWisp(DEFAULT_WISP);
            } else {
                renderServerList();
            }
        };

        async function checkServerHealth(url, element) {
            const dot = element.querySelector('.status-indicator');
            const text = element.querySelector('.ping-text');
            const start = Date.now();

            const markOffline = () => {
                dot.classList.add('status-error');
                text.textContent = "Offline";
            };

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 2000);

                await fetch(url.replace('wss://', 'https://').replace('/wisp/', '/health') || url, {
                    method: 'HEAD',
                    signal: controller.signal,
                    mode: 'no-cors'
                });

                clearTimeout(timeout);
                dot.classList.add('status-success');
                text.textContent = `${Date.now() - start}ms`;
            } catch {
                try {
                    const wsTest = new WebSocket(url);
                    wsTest.onopen = () => {
                        dot.classList.add('status-success');
                        text.textContent = `${Date.now() - start}ms`;
                        wsTest.close();
                    };
                    wsTest.onerror = markOffline;

                    setTimeout(() => {
                        if (wsTest.readyState !== WebSocket.OPEN) {
                            wsTest.close();
                            markOffline();
                        }
                    }, 1000);
                } catch { markOffline(); }
            }
        }

        function setWisp(url) {
            const oldUrl = localStorage.getItem('proxServer');
            localStorage.setItem('proxServer', url);

            if (oldUrl !== url) {
                const serverName = [...WISP_SERVERS, ...getStoredWisps()].find(s => s.url === url)?.name ?? 'Custom Server';
                proxyNotify('success', 'Proxy Changed', `Switching to ${serverName}...`);
            }

            navigator.serviceWorker.controller?.postMessage({ type: 'config', wispurl: url });
            setTimeout(() => location.reload(), 600);
        }


        function hideErudaEntryBtn(win) {
            const attempt = (tries) => {
                try {
                    const container = win.document.getElementById('eruda');
                    if (!container) {
                        if (tries > 0) setTimeout(() => attempt(tries - 1), 80);
                        return;
                    }
                    const root = container.shadowRoot || container;
                    const btn = root.querySelector('.eruda-entry-btn');
                    if (btn) {
                        btn.style.cssText += 'display:none!important;visibility:hidden!important;pointer-events:none!important;';
                    } else if (tries > 0) {
                        setTimeout(() => attempt(tries - 1), 80);
                    }
                } catch { }
            };
            attempt(10);
        }

        function toggleDevTools() {
            const tab = getActiveTab();
            const win = tab?.frame.frame.contentWindow;
            if (!win) return;

            if (win.eruda) {
                const panel = win.eruda._shadowRoot || win.document.querySelector('.__chobitsu-hide__') || win.eruda._container;
                if (tab._erudaOpen) {
                    win.eruda.hide();
                    tab._erudaOpen = false;
                } else {
                    win.eruda.show();
                    hideErudaEntryBtn(win);
                    tab._erudaOpen = true;
                }
                return;
            }

            const script = win.document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/eruda";
            script.onload = () => {
                win.eruda.init();
                win.eruda.show();
                hideErudaEntryBtn(win);
                tab._erudaOpen = true;
            };
            win.document.body.appendChild(script);
        }

        async function checkHashParameters() {
            if (window.location.hash) {
                const hash = decodeURIComponent(window.location.hash.substring(1));
                if (hash) handleSubmit(hash);
                history.replaceState(null, null, location.pathname);
            }
        }


        async function proxyInit() {
            const root = document.getElementById('proxy-app');
            const _piSteps = [
                { id: 'pi-s1', label: 'Fetching server list' },
                { id: 'pi-s2', label: 'Selecting fastest server' },
                { id: 'pi-s3', label: 'Loading proxy engine' },
                { id: 'pi-s4', label: 'Opening transport' },
                { id: 'pi-s5', label: 'Registering service worker' },
            ];
            root.innerHTML = `
                <div id="proxy-init-screen" style="
                    display:flex; align-items:center; justify-content:center;
                    width:100%; height:100%;
                    background:var(--bg); font-family:var(--font);">
                    <div style="
                        text-align:center; max-width:340px; width:90%;
                        padding:36px 32px;
                        background:rgba(10,10,15,0.7);
                        backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
                        border:1px solid rgba(88,196,220,0.15);
                        border-radius: 12px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                        <div style="
                            width:42px; height:42px; margin:0 auto 20px;
                            border:3px solid rgba(88,196,220,0.1);
                            border-top-color:var(--accent);
                            border-right-color:#34d399;
                            border-radius:50%;
                            animation:spin 0.8s linear infinite;">
                        </div>
                        <div style="font-size: 1.7rem; font-weight:300; letter-spacing: 0.3em; text-transform:uppercase; color:var(--accent); margin-bottom:20px; text-shadow: 0 0 20px rgba(88,196,220,0.3);">
                            PRISM
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
                            ${_piSteps.map(s => `
                                <div id="${s.id}" style="display:flex; align-items:center; gap:10px; font-size:1.35rem; color:var(--text-dim); transition:color 0.3s;">
                                    <span id="${s.id}-icon" style="
                                        width:18px; height:18px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
                                        border:1.5px solid var(--border); border-radius:50%; font-size:0.6rem; color:var(--text-dim); transition:0.3s;">
                                        ○
                                    </span>
                                    ${s.label}
                                </div>`).join('')}
                        </div>
                        <div id="pi-bar-wrap" style="
                            height:3px; background:rgba(88,196,220,0.1); border-radius: 8px; margin-top:22px; overflow:hidden;">
                            <div id="pi-bar" style="
                                height:100%; width:0%; background:linear-gradient(90deg, var(--accent), #34d399);
                                transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
                                border-radius: 8px;">
                            </div>
                        </div>
                    </div>
                </div>`;

            const _piMark = (stepId, state) => {
                const row = document.getElementById(stepId);
                const icon = document.getElementById(stepId + '-icon');
                const bar = document.getElementById('pi-bar');
                if (!row || !icon) return;
                const idx = _piSteps.findIndex(s => s.id === stepId);
                if (state === 'active') {
                    row.style.color = 'var(--text-primary)';
                    icon.textContent = '◌';
                    icon.style.borderColor = 'var(--accent)';
                    icon.style.color = 'var(--accent)';
                    if (bar) bar.style.width = ((idx / _piSteps.length) * 100) + '%';
                } else if (state === 'done') {
                    row.style.color = 'var(--accent)';
                    icon.textContent = '✓';
                    icon.style.borderColor = 'var(--accent)';
                    icon.style.color = 'var(--accent)';
                    icon.style.background = 'rgba(220,220,220,0.08)';
                    if (bar) bar.style.width = (((idx + 1) / _piSteps.length) * 100) + '%';
                }
            };

            const ntTemplate = document.getElementById('nt-html-template');
            const _ntStyles = getComputedStyle(document.documentElement);
            const _ntGetVar = (v) => _ntStyles.getPropertyValue(v).trim();
            const _ntThemeScript = `<script>
(function() {
    var r = document.documentElement;
    r.style.setProperty('--nt-bg',             \`${_ntGetVar('--bg')}\`);
    r.style.setProperty('--nt-accent',         \`${_ntGetVar('--accent')}\`);
    r.style.setProperty('--nt-accent-glow',    \`${_ntGetVar('--accent-glow')}\`);
    r.style.setProperty('--nt-text-primary',   \`${_ntGetVar('--text-primary')}\`);
    r.style.setProperty('--nt-text-dim',       \`${_ntGetVar('--text-dim')}\`);
    r.style.setProperty('--nt-border',         \`${_ntGetVar('--border')}\`);
    r.style.setProperty('--nt-card-bg',        \`${_ntGetVar('--card-bg')}\`);
    r.style.setProperty('--nt-input-bg',       \`${_ntGetVar('--input-bg')}\`);
    r.style.setProperty('--nt-font',           \`${_ntGetVar('--font')}\`);
    r.style.setProperty('--nt-bg-image',       \`${_ntGetVar('--bg-image')}\`);
    r.style.setProperty('--nt-bg-blur',        \`${_ntGetVar('--bg-blur')}\`);
    r.style.setProperty('--nt-bg-brightness',  \`${_ntGetVar('--bg-brightness')}\`);
})();
<\/script>`;
            let _ntHtml = ntTemplate.innerHTML;
            _ntHtml = _ntHtml.includes('<head>') ? _ntHtml.replace('<head>', '<head>' + _ntThemeScript) : _ntThemeScript + _ntHtml;
            const ntBlob = new Blob([_ntHtml], { type: 'text/html' });
            window.__ntBlobURL = URL.createObjectURL(ntBlob);

            try {
                _piMark('pi-s1', 'active');
                await fetchWispServers();
                _piMark('pi-s1', 'done');

                _piMark('pi-s2', 'active');
                await initializeWithBestServer();
                _piMark('pi-s2', 'done');

                _piMark('pi-s3', 'active');
                await getSharedScramjet();
                _piMark('pi-s3', 'done');

                _piMark('pi-s4', 'active');
                await getSharedConnection();
                _piMark('pi-s4', 'done');

                if ('serviceWorker' in navigator) {
                    _piMark('pi-s5', 'active');
                    const reg = await navigator.serviceWorker.register(getBasePath() + 'sw.js', { scope: getBasePath() });

                    await navigator.serviceWorker.ready;

                    const wispUrl = localStorage.getItem("proxServer") ?? DEFAULT_WISP;
                    const allServers = getAllWispServers();
                    const autoswitch = localStorage.getItem('wispAutoswitch') !== 'false';

                    const swConfig = {
                        type: "config",
                        wispurl: wispUrl,
                        servers: allServers,
                        autoswitch: autoswitch
                    };

                    const sendConfig = async () => {
                        const sw = reg.active || navigator.serviceWorker.controller;
                        if (sw) {
                            console.log("Sending config to SW:", swConfig);
                            sw.postMessage(swConfig);
                        }
                    };
                    sendConfig();
                    setTimeout(sendConfig, 500);
                    setTimeout(sendConfig, 1500);

                    navigator.serviceWorker.addEventListener('message', (event) => {
                        const { type, url, name, message } = event.data;
                        if (type === 'wispChanged') {
                            console.log("SW reported Wisp Change:", event.data);
                            localStorage.setItem("proxServer", url);
                            proxyNotify('info', 'Autoswitched Proxy', `Now using ${name} because the previous server was slow or offline.`);
                        } else if (type === 'wispError') {
                            console.error("SW reported Wisp Error:", event.data);
                            proxyNotify('error', 'Proxy Error', message);
                        }
                    });

                    reg.update();
                    _piMark('pi-s5', 'done');
                }

                await initializeBrowser();
            } catch (err) {
                console.error("Proxy initialization error:", err);
                const root = document.getElementById('proxy-app');
                if (root) {
                    root.innerHTML = `
                        <div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-family:var(--font);background:var(--bg);color:var(--text-primary);font-size:14px;">
                            <div style="text-align:center;max-width:500px;width:90%;padding:32px;background:rgba(10,10,15,0.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(88,196,220,0.15);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
                                <div style="font-size:1.8rem;font-weight:700;color:var(--accent);margin-bottom:16px;letter-spacing:0.08em;text-transform:uppercase;font-family:var(--font);">Init Error</div>
                                <p style="margin-bottom:20px;line-height:1.7;color:var(--text-dim);font-size:1.6rem;font-family:var(--font);">${err.message || 'Unknown error during initialization'}</p>
                                <p style="color:var(--text-dim);font-size:1.25rem;margin-bottom:20px;letter-spacing:0.06em;text-transform:uppercase;font-family:var(--font);">Check console (F12) for details</p>
                                <button onclick="proxyBrowserInitialized=false; nav('proxy');" style="padding:10px 24px;background:linear-gradient(135deg,#00f2ff,#34d399);color:#0a0a0f;border:none;border-radius:8px;cursor:pointer;font-family:var(--font);font-weight:700;font-size:1.5rem;letter-spacing:0.05em;text-transform:uppercase;transition:0.2s;">Retry</button>
                            </div>
                        </div>
                    `;
                }
            }
        }
        // ---END PROXY BROWSER LOGIC---

        proxyInit();

// ── Storage keys ──────────────────────────
        const PS_THEME_KEY   = 'prism_theme';
        const PS_CLOAK_KEY   = 'prism_cloak';
        const PS_CLOAK_TITLE = 'prism_cloak_title';
        const PS_CLOAK_FAVI  = 'prism_cloak_favicon';
        const PS_DONE_KEY    = 'prism_onboarding_done';

        // ── Saved states ─────────────────────────
        let _obCurrentTheme = localStorage.getItem(PS_THEME_KEY) || 'default';
        let _obCurrentCloak = localStorage.getItem(PS_CLOAK_KEY) || 'none';
        let _obStep = 0;

        // ── Apply theme to <html> data-theme ──────
        function applyTheme(theme) {
            const el = document.documentElement;
            el.removeAttribute('data-theme');
            if (theme && theme !== 'default') el.setAttribute('data-theme', theme);

            // Sapphire (amethyst) needs manual vars since it's not a named preset
            if (theme === 'sapphire') {
                el.style.setProperty('--accent', '#818cf8');
                el.style.setProperty('--accent-secondary', '#e879f9');
                el.style.setProperty('--accent-glow', 'rgba(129,140,248,0.22)');
                el.style.setProperty('--border', 'rgba(129,140,248,0.12)');
                el.style.setProperty('--card-bg', 'rgba(129,140,248,0.03)');
                el.style.setProperty('--input-bg', 'rgba(129,140,248,0.05)');
                el.style.setProperty('--glass-border', 'rgba(129,140,248,0.14)');
            } else {
                // Clear any inline overrides so CSS vars take over
                ['--accent','--accent-secondary','--accent-glow','--border','--card-bg','--input-bg','--glass-border']
                    .forEach(v => el.style.removeProperty(v));
            }
            localStorage.setItem(PS_THEME_KEY, theme);
            _obCurrentTheme = theme;
        }

        // ── Apply tab cloaker ─────────────────────
        function applyCloak(cloak, title, favicon) {
            if (cloak === 'none' || !cloak) {
                document.title = 'Prism';
                setFavicon('');
                localStorage.setItem(PS_CLOAK_KEY, 'none');
                localStorage.removeItem(PS_CLOAK_TITLE);
                localStorage.removeItem(PS_CLOAK_FAVI);
            } else {
                document.title = title || 'Prism';
                setFavicon(favicon || '');
                localStorage.setItem(PS_CLOAK_KEY, cloak);
                localStorage.setItem(PS_CLOAK_TITLE, title || '');
                localStorage.setItem(PS_CLOAK_FAVI, favicon || '');
            }
            _obCurrentCloak = cloak;
        }

        function setFavicon(url) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            if (url) {
                link.href = url;
            } else {
                link.removeAttribute('href');
                link.href = '';
            }
        }

        // ── Onboarding step logic ─────────────────
        function obShowStep(n) {
            document.querySelectorAll('.ob-step').forEach((el, i) => {
                el.classList.toggle('visible', i === n);
            });
            document.querySelectorAll('#ob-step-dots .ob-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === n);
                dot.classList.toggle('done', i < n);
            });
            _obStep = n;
        }

        function obNext() {
            if (_obStep < 3) obShowStep(_obStep + 1);
        }

        function obBack() {
            if (_obStep > 0) obShowStep(_obStep - 1);
        }

        window.obSelectTheme = function(card) {
            document.querySelectorAll('#ob-theme-grid .ob-theme-card')
                .forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            applyTheme(card.dataset.theme);
        };

        window.obSelectCloak = function(option) {
            document.querySelectorAll('#ob-cloak-grid .ob-cloak-option')
                .forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            applyCloak(option.dataset.cloak, option.dataset.title, option.dataset.favicon);
        };

        window.obFinish = function() {
            localStorage.setItem(PS_DONE_KEY, '1');
            const overlay = document.getElementById('prism-onboarding');
            overlay.style.animation = 'none';
            overlay.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.97)';
            setTimeout(() => overlay.classList.add('ob-hidden'), 400);
        };

        // ── Post-onboarding Settings modal ────────
        window.openPrismSettings = function() {
            const modal = document.getElementById('prism-settings-modal');
            modal.classList.remove('ps-hidden');
            syncSettingsModal();
            bgRenderSlots();
            modal.onclick = (e) => { if (e.target === modal) closePrismSettings(); };
        };

        window.closePrismSettings = function() {
            document.getElementById('prism-settings-modal').classList.add('ps-hidden');
        };

        function syncSettingsModal() {
            // sync theme
            document.querySelectorAll('#ps-theme-grid .ob-theme-card').forEach(c => {
                c.classList.toggle('selected', c.dataset.theme === _obCurrentTheme);
            });
            // sync cloak
            document.querySelectorAll('#ps-cloak-grid .ob-cloak-option').forEach(o => {
                o.classList.toggle('selected', o.dataset.cloak === _obCurrentCloak);
            });
        }

        window.psSelectTheme = function(card) {
            document.querySelectorAll('#ps-theme-grid .ob-theme-card')
                .forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            applyTheme(card.dataset.theme);
        };

        window.psSelectCloak = function(option) {
            document.querySelectorAll('#ps-cloak-grid .ob-cloak-option')
                .forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            applyCloak(option.dataset.cloak, option.dataset.title, option.dataset.favicon);
        };

        // ── Background presets ────────────────────
        // ── Background presets ────────────────────
        const PS_BG_KEY    = 'prism_bg';
        const BG_SLOTS     = 4;

        function allBgCards() {
            return document.querySelectorAll('#ps-bg-grid .bg-preset-card, #ps-bg-custom-grid .bg-preset-card');
        }

        function bgRenderSlots() {
            for (let i = 0; i < BG_SLOTS; i++) {
                const card = document.getElementById(`bg-slot-${i}`);
                if (!card) continue;
                const saved = localStorage.getItem(`prism_bg_slot_${i}`);
                if (saved) {
                    card.innerHTML = `<img class="bg-preset-thumb" src="${saved}" alt="Custom ${i+1}">
                        <button class="bg-delete-btn" title="Remove" onclick="bgDeleteSlot(event,${i})"><i class="fa-solid fa-xmark"></i></button>`;
                    card.classList.remove('bg-preset-slot');
                    card.dataset.url = saved;
                } else {
                    card.innerHTML = `<i class="fa-regular fa-image"></i><span>Empty</span>`;
                    card.classList.add('bg-preset-slot');
                    card.dataset.url = '';
                }
            }
            const hint = document.getElementById('bg-upload-hint');
            if (hint) {
                const nextEmpty = [...Array(BG_SLOTS).keys()].find(i => !localStorage.getItem(`prism_bg_slot_${i}`));
                hint.textContent = nextEmpty !== undefined ? `Fills slot ${nextEmpty + 1}` : 'All slots full';
            }
        }

        function bgDeleteSlot(e, i) {
            e.stopPropagation();
            const wasActive = localStorage.getItem(PS_BG_KEY) === `custom${i}`;
            localStorage.removeItem(`prism_bg_slot_${i}`);
            if (wasActive) {
                applyBg('none', '');
                allBgCards().forEach(c => c.classList.remove('selected'));
                document.querySelector('#ps-bg-grid [data-bg="none"]').classList.add('selected');
            }
            bgRenderSlots();
        }

        window.bgHandleUpload = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const nextEmpty = [...Array(BG_SLOTS).keys()].find(i => !localStorage.getItem(`prism_bg_slot_${i}`));
            if (nextEmpty === undefined) {
                document.getElementById('bg-upload-hint').textContent = 'All slots full — delete one first';
                e.target.value = ''; return;
            }
            const reader = new FileReader();
            reader.onload = function(ev) {
                try { localStorage.setItem(`prism_bg_slot_${nextEmpty}`, ev.target.result); }
                catch(err) { document.getElementById('bg-upload-hint').textContent = 'Image too large for storage'; e.target.value = ''; return; }
                bgRenderSlots();
                const card = document.getElementById(`bg-slot-${nextEmpty}`);
                if (card) psSelectBg(card);
                e.target.value = '';
            };
            reader.readAsDataURL(file);
        };

        function applyBg(bgKey, url) {
            const wall = document.getElementById('prism-wallpaper');
            const root = document.documentElement;
            if (!bgKey || bgKey === 'none' || !url) {
                if (wall) { wall.style.backgroundImage = 'none'; wall.style.filter = 'none'; }
                root.style.setProperty('--bg-image', 'none');
                root.style.setProperty('--bg-blur', '0px');
                root.style.setProperty('--bg-brightness', '100%');
                localStorage.setItem(PS_BG_KEY, 'none');
            } else {
                if (wall) {
                    wall.style.backgroundImage = `url('${url}')`;
                    wall.style.filter = 'blur(4px) brightness(40%)';
                }
                root.style.setProperty('--bg-image', `url('${url}')`);
                root.style.setProperty('--bg-blur', '4px');
                root.style.setProperty('--bg-brightness', '40%');
                localStorage.setItem(PS_BG_KEY, bgKey);
                if (bgKey.startsWith('custom')) localStorage.setItem(PS_BG_KEY + '_url', url);
            }
            try {
                const iframe = document.getElementById('app-frame');
                if (iframe && iframe.contentWindow)
                    iframe.contentWindow.postMessage({ type: 'prism-bg', bgKey, url: url || '' }, '*');
            } catch(e) {}
        }

        window.psSelectBg = function(card) {
            allBgCards().forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const bg  = card.dataset.bg;
            const url = bg === 'none' ? '' : (card.dataset.url || '');
            applyBg(bg, url);
        };

        // ── Floating Taskbar ─────────────────────
        (function initTaskbar() {
            const taskbar  = document.getElementById('prism-taskbar');
            const hint     = document.getElementById('tb-show-hint');
            const hideBtn  = document.getElementById('tb-hide');

            function showTaskbar() {
                taskbar.classList.remove('tb-hidden');
                hint.style.opacity = '0';
            }
            function hideTaskbar() {
                taskbar.classList.add('tb-hidden');
                hint.style.opacity = '1';
            }

            hideBtn.addEventListener('click', () => {
                hideTaskbar();
            });
            hint.addEventListener('click', showTaskbar);

            // Backslash toggles
            function onKey(e) {
                if (e.code !== 'Backslash' || e.repeat) return;
                e.preventDefault();
                taskbar.classList.contains('tb-hidden') ? showTaskbar() : hideTaskbar();
            }
            window.addEventListener('keydown', onKey, true);
        })();

        window.tbNav = function(page) {
            window.__hideBrowserChrome?.();
            const tab = typeof getActiveTab === 'function' ? getActiveTab() : null;
            if (tab && window.__ntBlobURL) {
                tab.frame.frame.src = window.__ntBlobURL;
                tab.title = "New Tab";
                tab.url = "";
                tab.favicon = null;
                if (typeof updateTabsUI === 'function') updateTabsUI();
                if (typeof updateAddressBar === 'function') updateAddressBar();
            }
        };
        (function prismSettingsBoot() {
            if (_obCurrentTheme === 'default') {
                _obCurrentTheme = 'ruby';
                localStorage.setItem(PS_THEME_KEY, 'ruby');
            }
            applyTheme(_obCurrentTheme);

            const savedCloak   = localStorage.getItem(PS_CLOAK_KEY)  || 'none';
            const savedTitle   = localStorage.getItem(PS_CLOAK_TITLE) || '';
            const savedFavicon = localStorage.getItem(PS_CLOAK_FAVI)  || '';
            applyCloak(savedCloak, savedTitle, savedFavicon);

            // Restore background — drive the wallpaper div directly
            const savedBg = localStorage.getItem(PS_BG_KEY) || 'none';
            if (savedBg !== 'none') {
                if (savedBg.startsWith('preset')) {
                    const card = document.querySelector(`[data-bg="${savedBg}"]`);
                    if (card && card.dataset.url) applyBg(savedBg, card.dataset.url);
                } else if (savedBg.startsWith('custom')) {
                    const idx = parseInt(savedBg.replace('custom', ''));
                    const url = !isNaN(idx) ? (localStorage.getItem(`prism_bg_slot_${idx}`) || '') : '';
                    if (url) applyBg(savedBg, url);
                }
            }

            const markGrid = (gridId, value, attr) => {
                document.querySelectorAll(`#${gridId} [${attr}]`).forEach(el => {
                    el.classList.toggle('selected', el.getAttribute(attr) === value);
                });
            };
            markGrid('ob-theme-grid', _obCurrentTheme, 'data-theme');
            markGrid('ob-cloak-grid', savedCloak, 'data-cloak');
            // Mark bg across both grids
            document.querySelectorAll('[data-bg]').forEach(el => {
                el.classList.toggle('selected', el.dataset.bg === savedBg);
            });

            if (!localStorage.getItem(PS_DONE_KEY)) {
                document.getElementById('prism-onboarding').classList.remove('ob-hidden');
            }
        })();