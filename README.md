# machinetalk-webgui

## Requirements

Machinekit needs available on your network and needs to be configured to use `mkwrapper`.
[mkwrapper-sim](https://github.com/strahlex/mkwrapper-sim) is an example configuration that supports `mkwrapper` as well as other related Machinetalk features.
If you want to use `mkwrapper` on an existing configuration, simply set the `DISPLAY` to `mkwrapper` like:
```ini
[DISPLAY]
DISPLAY = mkwrapper
```

Additionally, Avahi or Bonjour needs to be running on the system where `machinetalk-webgui` is installed.


## Installation

```
git clone https://github.com/bobvanderlinden/machinetalk-webgui/
cd machinetalk-webgui
npm install
```

## Usage

To start the server use:
```
npm start
```
The server will listen on port 3000, so it should be available at http://localhost:3000/
