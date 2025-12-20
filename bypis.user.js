// ==UserScript==
// @name         NSM BYPASS
// @namespace    http://tampermonkey.net/
// @version      36.67
// @description  NSM BYPASS
// @author       NamSomain
// @match        https://link4m.com/*
// @icon         https://i.postimg.cc/ZRFW6GHx/chicawa-nerd.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const GITHUB_RAW_URL =
        'https://raw.githubusercontent.com/sn2686364-del/skidskibidihihinamsomain/main/linktung.user.js';

    const THEMES = {
        Cyan:   { header: '#00f2fe,#4facfe', btn: '#00f2fe,#4facfe' },
        Purple: { header: '#7f00ff,#e100ff', btn: '#7f00ff,#e100ff' },
        Red:    { header: '#ff416c,#ff4b2b', btn: '#ff416c,#ff4b2b' },
        Green:  { header: '#00ff99,#00cc66', btn: '#00ff99,#00cc66' },
    };

    const ready = fn =>
        document.readyState !== 'loading'
            ? fn()
            : document.addEventListener('DOMContentLoaded', fn);

    ready(() => {
        injectStyle();
        createPanel();
    });

    function injectStyle() {
        GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');

        #boss-panel {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 999999;
            width: 280px;
            background: rgba(10,10,15,0.85);
            backdrop-filter: blur(14px);
            border-radius: 18px;
            box-shadow: 0 0 25px rgba(0,200,255,.35),
                        0 0 60px rgba(255,0,100,.25);
            font-family: 'Orbitron', sans-serif;
            color: #fff;
            overflow: hidden;
            animation: bossFade .6s ease;
            cursor: grab;
        }

        @keyframes bossFade {
            from { opacity:0; transform: translateY(-10px) scale(.95); }
            to   { opacity:1; transform: none; }
        }

        #boss-header {
            padding: 14px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 1px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
            text-shadow: 0 0 8px rgba(255,255,255,.6);
            border-radius: 18px 18px 0 0;
            background: linear-gradient(135deg,#00f2fe,#4facfe);
        }

        #boss-toggle {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: none;
            background: rgba(255,255,255,.25);
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            transition: .3s;
        }

        #boss-toggle:hover { transform: rotate(180deg) scale(1.1); }

        #boss-body {
            padding: 16px;
            max-height: 300px;
            transition: max-height .35s ease, opacity .35s ease;
        }

        .min #boss-body {
            max-height: 0;
            opacity: 0;
            pointer-events: none;
        }

        #boss-btn {
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 1px;
            color: #fff;
            cursor: pointer;
            background: linear-gradient(135deg,#00f2fe,#4facfe);
            box-shadow: 0 0 15px rgba(0,242,254,.8),
                        inset 0 0 10px rgba(255,255,255,.25);
            transition: .25s;
        }

        #boss-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 0 25px rgba(0,242,254,1);
        }

        #boss-btn:disabled {
            opacity: .6;
            cursor: not-allowed;
        }

        #boss-footer {
            margin-top: 12px;
            text-align: center;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #00f2fe;
            text-shadow:
                0 0 6px rgba(0,242,254,.8),
                0 0 12px rgba(0,242,254,.6),
                0 0 20px rgba(0,242,254,.4);
            animation: neonFlash 1.5s infinite alternate;
            user-select: none;
        }

        @keyframes neonFlash {
            from { opacity:.7; text-shadow:0 0 6px rgba(0,242,254,.5),0 0 12px rgba(0,242,254,.3),0 0 20px rgba(0,242,254,.2);}
            to   { opacity:1; text-shadow:0 0 10px rgba(0,242,254,1),0 0 20px rgba(0,242,254,.8),0 0 35px rgba(0,242,254,.6);}
        }

        #theme-selector {
            margin-top: 12px;
            width: 100%;
            border-radius: 8px;
            padding: 6px;
            font-family: 'Orbitron', sans-serif;
            font-weight: 600;
            background: rgba(0,0,0,.25);
            color: #fff;
            border: none;
            cursor: pointer;
        }
        `);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'boss-panel';
        panel.innerHTML = `
            <div id="boss-header">
                <span>⚡ NSM BYPASS</span>
                <button id="boss-toggle">−</button>
            </div>
            <div id="boss-body">
                <button id="boss-btn">ACTIVATE BYPASS</button>
                <div id="boss-footer">ChatGPT · Final Boss</div>
                <select id="theme-selector"></select>
            </div>
        `;
        document.documentElement.appendChild(panel);

        const toggle = panel.querySelector('#boss-toggle');
        const btn = panel.querySelector('#boss-btn');
        const header = panel.querySelector('#boss-header');
        const themeSelect = panel.querySelector('#theme-selector');

        toggle.onclick = e => { e.stopPropagation(); panel.classList.toggle('min'); toggle.textContent = panel.classList.contains('min') ? '+' : '−'; };
        header.onclick = () => toggle.click();

        Object.keys(THEMES).forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; themeSelect.appendChild(o); });

        let savedTheme = localStorage.getItem('nsm_bypass_theme') || 'Cyan';
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);

        themeSelect.onchange = () => {
            applyTheme(themeSelect.value);
            localStorage.setItem('nsm_bypass_theme', themeSelect.value);
        };

        function applyTheme(t) {
            header.style.background = `linear-gradient(135deg,${THEMES[t].header})`;
            btn.style.background = `linear-gradient(135deg,${THEMES[t].btn})`;
        }

        btn.onclick = () => {
            btn.disabled = true;
            btn.textContent = 'EXECUTING...';

            GM_xmlhttpRequest({
                method: 'GET',
                url: GITHUB_RAW_URL,
                onload: res => {
                    if (res.status === 200) {
                        let ok = true;
                        try { unsafeWindow.eval(res.responseText); } catch (e) { console.error(e); ok = false; }
                        btn.textContent = ok ? 'BYPASS COMPLETE' : 'EXEC ERROR';
                    } else btn.textContent = 'LOAD FAILED';
                    setTimeout(resetBtn, 3500);
                },
                onerror: () => { btn.textContent = 'NETWORK ERROR'; setTimeout(resetBtn, 3500); }
            });
        };

        function resetBtn() { btn.disabled = false; btn.textContent = 'ACTIVATE BYPASS'; btn.style.background = `linear-gradient(135deg,${THEMES[themeSelect.value].btn})`; }

        dragElement(panel);
        function dragElement(el) {
            let pos1=0,pos2=0,pos3=0,pos4=0;
            header.style.cursor = 'grab';
            header.onmousedown = dragMouseDown;

            function dragMouseDown(e){
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDrag;
                document.onmousemove = elementDrag;
                el.style.cursor = 'grabbing';
            }
            function elementDrag(e){
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            }
            function closeDrag(){
                document.onmouseup = null;
                document.onmousemove = null;
                el.style.cursor = 'grab';
            }
        }
    }
})();
