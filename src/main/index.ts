import icon from './assets/1.png';
import './ipc';

import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';
import { join } from 'path';
import type { Event } from 'electron';

if (process.platform === 'win32') app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

const initializeTray = (win: BrowserWindow) => {
    // I spent all my nerves to properly initialize the icon
    // For DEV / PROD / SYSTEM STARTUP as it turned out, 3 different paths to the file were required
    // So I just imported it directly
    const tray = new Tray(nativeImage.createFromDataURL(icon));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                win.show();
            }
        },
        {
            label: 'Quit App',
            click: () => {
                win.hide();
                app.quit();
                process.exit();
            }
        }
    ]);

    tray.setToolTip('Robust Vault');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        if (!win.isVisible()) {
            win.show();
        } else {
            win.hide();
        }
    });
};

(async () => {
    await app.whenReady();

    const win = new BrowserWindow({
        icon: nativeImage.createFromDataURL(icon),
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            sandbox: false
        }
    });

    win.setMenu(null);
    if (app.isPackaged) {
        win.setMenu(null);
    }

    win.on('close', (event: Event) => {
        event.preventDefault();
        if (win) win.hide();
    });

    win.once('ready-to-show', () => {
        if (!process.argv.includes('MINIMIZED')) {
            if (win) win.show();
        }

        // FOR MAC OS IN FUTURE
        // const { wasOpenedAsHidden } = app.getLoginItemSettings();
        // if (!wasOpenedAsHidden) {
        //     win.show();
        // }
    });

    if (app.isPackaged) {
        win.loadFile(join(__dirname, '../renderer/index.html'));
    } else {
        win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`);
    }

    initializeTray(win);
})();

// app.on('second-instance', () => {
//     if (win) {
//         if (win.isMinimized()) win.restore();
//         win.focus();
//     }
// });

// app.on('activate', () => {
//     const allWindows = BrowserWindow.getAllWindows();

//     if (allWindows.length) {
//         allWindows[0].focus();
//     } else {
//         initializeWindow();
//     }
// });
