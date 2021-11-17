# Zebra IOTA Edge SDK

Enables Zebra edge devices to the IOTA Tangle.

This is a monorepo containing 3 Svelte + Capacitor apps under `./identity-enabler/*-app` and a shared common package under `./packages/common`.

## Setup

```shell
# Install all packages in this workspace / monorepo
npm install
```

### Run local dev server

```shell
npm run build:dev -w "@zebra-iota-edge-sdk/holder-mobile-app"

npm run build:dev -w "@zebra-iota-edge-sdk/verifier-mobile-app"

npm run build:dev -w "@zebra-iota-edge-sdk/device-id-mobile-app"
```

### Develop on your device with livereload (hot reload)

If you're only targeting Android, you only need to change the `server.url` section in `capacitor.config.json` in the app directory to use `http://10.0.2.2:5001`, since [Android Studio already adds a `localhost` proxy](https://stackoverflow.com/questions/9808560/why-do-we-use-10-0-2-2-to-connect-to-local-web-server-instead-of-using-computer). Just remember to remove it when building your app for production.

If you're targeting iOS or both, you will need to append your workstation IP to the `server.url` section in `capacitor.config.json` instead. To discover your workstation IP, just run `ifconfig` or find it on the network settings.

Tip: Remember you will need the `http://` before the server ip.

Back in the root folder:

```bash
yarn dev
```

This will run the capacitor/svelte project with a web view pointing to your workstation's IP.

* You need to have an emulator/device connected to adb
* Your device has to be connected to the same wifi network as your workstation.

### To build a production application

**Remember to remove the `server.url` in `capacitor.config.json`**

```shell
npm run build -w "@zebra-iota-edge-sdk/holder-mobile-app"

npm run build -w "@zebra-iota-edge-sdk/verifier-mobile-app"

npm run build -w "@zebra-iota-edge-sdk/device-id-mobile-app"
```
