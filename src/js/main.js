import LudoGame from './game/LudoGame.js';
import UIManager from './ui/UIManager.js';
import WebSocketClient from './multiplayer/WebSocketClient.js';
import { Constants } from './utils/Constants.js';

class GameManager {
    constructor() {
        this.currentUser = 'DarkAarush';
        this.currentTime = '2025-07-26 11:49:45';
        this.game = null;
        this.ui = new UIManager();
        this.ws = new WebSocketClient();
        this.initializeGame();
    }

    async initializeGame() {
        try {
            // Show loading screen
            this.ui.showLoadingScreen();

            // Initialize WebSocket connection
            await this.ws.connect();

            // Initialize game components
            await this.initializeComponents();

            // Hide loading screen and show menu
            this.ui.hideLoadingScreen();
            this.ui.showMenuScreen();

            // Bind event listeners
            this.bindEvents();

        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.ui.showError('Failed to initialize game. Please refresh the page.');
        }
    }

    async initializeComponents() {
        // Load assets
        await this.loadAssets();

        // Initialize settings
        this.loadSettings();

        // Initialize audio
        this.initializeAudio();
    }

    async loadAssets() {
        const assets = [
            'models/board/board.gltf',
            'models/pieces/piece.gltf',
            'textures/board/board_texture.png',
            'textures/pieces/piece_texture.png',
            'audio/dice_roll.mp3',
            'audio/piece_move.mp3',
            'audio/win.mp3'
        ];

        for (const asset of assets) {
            await this.loadAsset(asset);
        }
    }

    async loadAsset(path) {
        return new Promise((resolve, reject) => {
            const extension = path.split('.').pop();
            
            switch (extension) {
                case 'gltf':
                    // Load 3D model
                    const loader = new THREE.GLTFLoader();
                    loader.load(
                        `src/assets/${path}`,
                        (gltf) => resolve(gltf),
                        undefined,
                        (error) => reject(error)
                    );
                    break;

                case 'png':
                case 'jpg':
                    // Load texture
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(
                        `src/assets/${path}`,
                        (texture) => resolve(texture),
                        undefined,
                        (error) => reject(error)
                    );
                    break;

                case 'mp3':
                    // Load audio
                    const audio = new Audio(`src/assets/${path}`);
                    audio.addEventListener('canplaythrough', () => resolve(audio));
                    audio.addEventListener('error', (error) => reject(error));
                    break;

                default:
                    reject(new Error(`Unsupported file type: ${extension}`));
            }
        });
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('ludoSettings');
        this.settings = savedSettings ? JSON.parse(savedSettings) : Constants.DEFAULT_SETTINGS;
    }

    initializeAudio() {
        this.audio = {
            diceRoll: document.querySelector('#audio-dice-roll'),
            pieceMove: document.querySelector('#audio-piece-move'),
            win: document.querySelector('#audio-win')
        };
    }

    bindEvents() {
        // Menu buttons
        document.querySelector('#play-local').addEventListener('click', () => {
            this.startLocalGame();
        });

        document.querySelector('#play-online').addEventListener('click', () => {
            this.startOnlineGame();
        });

        document.querySelector('#play-ai').addEventListener('click', () => {
            this.startAIGame();
        });

        document.querySelector('#settings').addEventListener('click', () => {
            this.ui.showSettingsModal();
        });

        // Game controls
        document.querySelector('#leave-game').addEventListener('click', () => {
            this.leaveGame();
        });

        // Settings controls
        document.querySelector('#close-settings').addEventListener('click', () => {
            this.ui.hideSettingsModal();
        });

        // Settings changes
        document.querySelector('#sound-enabled').addEventListener('change', (e) => {
            this.updateSettings({ sound: e.target.checked });
        });

        document.querySelector('#music-enabled').addEventListener('change', (e) => {
            this.updateSettings({ music: e.target.checked });
        });

        document.querySelector('#graphics-quality').addEventListener('change', (e) => {
            this.updateSettings({ quality: e.target.value });
        });

        document.querySelector('#theme-select').addEventListener('change', (e) => {
            this.updateSettings({ theme: e.target.value });
        });
    }

    startLocalGame() {
        this.game = new LudoGame({
            mode: 'local',
            players: 2,
            ui: this.ui,
            ws: this.ws
        });
        
        this.ui.hideMenuScreen();
        this.ui.showGameScreen();
        this.game.start();
    }

    async startOnlineGame() {
        try {
            const room = await this.ws.createRoom();
            
            this.game = new LudoGame({
                mode: 'online',
                room: room,
                ui: this.ui,
                ws: this.ws
            });

            this.ui.hideMenuScreen();
            this.ui.showGameScreen();
            this.game.start();

        } catch (error) {
            console.error('Failed to start online game:', error);
            this.ui.showError('Failed to start online game. Please try again.');
        }
    }

    startAIGame() {
        this.game = new LudoGame({
            mode: 'ai',
            difficulty: this.settings.aiDifficulty,
            ui: this.ui,
            ws: this.ws
        });

        this.ui.hideMenuScreen();
        this.ui.showGameScreen();
        this.game.start();
    }

    leaveGame() {
        if (this.game) {
            this.game.end();
            this.game = null;
        }

        this.ui.hideGameScreen();
        this.ui.showMenuScreen();
    }

    updateSettings(newSettings) {
        this.settings = {
            ...this.settings,
            ...newSettings
        };

        localStorage.setItem('ludoSettings', JSON.stringify(this.settings));
        this.applySettings();
    }

    applySettings() {
        // Apply theme
        document.body.className = this.settings.theme;

        // Apply sound settings
        Object.values(this.audio).forEach(audio => {
            audio.muted = !this.settings.sound;
        });

        // Apply quality settings
        if (this.game) {
            this.game.updateQuality(this.settings.quality);
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
});
