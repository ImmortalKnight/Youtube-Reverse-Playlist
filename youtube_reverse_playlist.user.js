// ==UserScript==
// @name         YouTube Stable Bottom Reverse Button
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Adds an integrated reverse button bar at the bottom of the playlist matching YouTube colors
// @author       ImmortalKnight (Gemini)
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectBottomOverlay() {
        // Targets the container holding the scrollable list of videos
        const scrollContainer = document.querySelector('ytd-playlist-panel-renderer #container #items, #playlist-items');

        if (scrollContainer && !document.getElementById('yt-stable-reverse-bar')) {

            // Create a dedicated control bar
            const controlBar = document.createElement('div');
            controlBar.id = 'yt-stable-reverse-bar';

            // Styled to sit perfectly at the bottom, matching native colors dynamically
            controlBar.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px;
                background: var(--yt-spec-menu-background, #1f1f1f);
                border-top: 1px solid var(--yt-spec-10-percent-layer, rgba(255, 255, 255, 0.1));
                border-radius: 0 0 8px 8px;
            `;

            // Create a sleek pill-shaped toggle button
            const btn = document.createElement('button');
            btn.innerText = '⇄ Reverse Playlist Order';
            btn.style.cssText = `
                background: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1));
                color: var(--yt-spec-text-primary, #f1f1f1);
                border: none;
                padding: 6px 16px;
                border-radius: 18px;
                font-family: Roboto, Arial, sans-serif;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                width: 100%;
                text-align: center;
                transition: background 0.2s;
            `;

            // Hover styles matching native buttons
            btn.onmouseenter = () => btn.style.background = 'var(--yt-spec-button-chip-background-hover, rgba(255, 255, 255, 0.2))';
            btn.onmouseleave = () => {
                if (btn.getAttribute('data-active') !== 'true') {
                    btn.style.background = 'var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1))';
                }
            };

            // Reverse mechanics
            btn.onclick = function() {
                const listItems = document.querySelector('#playlist-items')?.parentElement;
                if (listItems) {
                    if (listItems.style.flexDirection === 'column-reverse') {
                        listItems.style.display = '';
                        listItems.style.flexDirection = '';
                        btn.style.background = 'var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1))';
                        btn.style.color = 'var(--yt-spec-text-primary, #f1f1f1)';
                        btn.setAttribute('data-active', 'false');
                    } else {
                        listItems.style.display = 'flex';
                        listItems.style.flexDirection = 'column-reverse';
                        btn.style.background = 'var(--yt-spec-text-primary, #ffffff)';
                        btn.style.color = 'var(--yt-spec-text-primary-inverse, #000000)';
                        btn.setAttribute('data-active', 'true');
                    }
                }
            };

            controlBar.appendChild(btn);

            // Append it right after the scrolling container to keep it strictly at the bottom
            scrollContainer.parentNode.appendChild(controlBar);
        }
    }

    // Keep checking every second to ensure it stays anchored when swapping videos
    setInterval(injectBottomOverlay, 1000);
})();