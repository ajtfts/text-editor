const {app, BrowserWindow, Menu} = require('electron')
const ipc = require('electron').ipcMain
const path = require('path')
const url = require('url')

let win

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600})
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	win.toggleDevTools()

	let menuTemplate = [
		{
			label: 'File',
			submenu: [
				{
					label: 'New File',
					accelerator: 'CmdOrCtrl+N',
					click: () => {
						win.webContents.send('newFile')
					}
				},
				{
					label: 'Open...',
					accelerator: 'CmdOrCtrl+O',
					click: () => {
						win.webContents.send('openFile')
					}
				},
				{
					label: 'Save',
					accelerator: 'CmdOrCtrl+S',
					click: () => {
						win.webContents.send('saveFile')
					}
				},
				{
					label: 'Save As...',
					accelerator: 'Shift+CmdOrCtrl+S',
					click: () => {
						win.webContents.send('saveFileAs')
					}
				},
			]
		},
		{
			label: 'Edit',
			submenu: [
				{role: "undo"},
				{role: "redo"},
			]
		}
	]

	if (process.platform === 'darwin') {
		menuTemplate.unshift({
			label: "aoue",
			submenu: [
				{role: 'about'}
			]
		})
	}

	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)

	win.on('closed', () => {
		win = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})