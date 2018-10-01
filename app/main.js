var $ = require('jquery');
const fs = require('fs');
const gui = require('nw.gui');

function sleep(milliSeconds) {
    let startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

nw.Window.open('loading.html', {
    fullscreen: false,
    frame: false,
    resizable: false,
    transparent: false,
    width: 500,
    height: 500
}, win => {
    setTimeout(() => {
        win.close();
        let tray;
        nw.Window.open(`index.html`, {
            fullscreen: false,
            frame: false,
            transparent: false,
            resizable: true,
            position: 'center'
        }, win => {
            win.on('minimize', function () {
                fs.writeFile('toto.txt', 'minimize');
                win.hide();
            });

            tray = new gui.Tray({ icon: 'icon.png' });

            win.on('maximize', function () {
                fs.writeFile('toto.txt', 'maximize');
            });

            win.on('close', function () {
                fs.writeFile('toto.txt', 'close');
                win.close();
            });

        });
    }, 7000)
});