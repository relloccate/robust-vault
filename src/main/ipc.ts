import { app, dialog, ipcMain } from 'electron';

// WHERE IS THE FUCKING OPEN FILE DIALOG IN ELECTRON RENDERER???????????????????????????????
ipcMain.handle('choose-path', async (event, file: boolean) => {
    try {
        const {
            filePaths: [path]
        } = await dialog.showOpenDialog({
            properties: [file ? 'openFile' : 'openDirectory']
        });

        if (path) return path;
    } catch (error) {
        console.error(error);
    }
});

// https://developpaper.com/electron-practical-tips-hide-the-main-window-at-startup-and-only-show-the-system-tray/
ipcMain.handle('set-on-startup', async (event, state: boolean) =>
    app.setLoginItemSettings({
        openAtLogin: state,
        // FOR MAC OS IN FUTURE
        openAsHidden: true,
        // FOR WINDOWS
        args: ['MINIMIZED']
    })
);

ipcMain.handle('get-on-startup', async () => app.getLoginItemSettings());
ipcMain.handle('get-version', app.getVersion);
