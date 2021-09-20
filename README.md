# Video Hotkeys

![build workflow](https://github.com/stcmz/video-hotkeys/actions/workflows/build.yml/badge.svg)
![release workflow](https://github.com/stcmz/video-hotkeys/actions/workflows/release.yml/badge.svg)

Video Hotkeys is a browser extension that enables YouTube-like hotkey experience for video websites.

## How to build

To build this extension, one needs to install [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first. Then simply run

```bash
# Restore npm packages
npm ci

# Build the TypeScript project with WebPack
npm run build

# Pack the extension and source code
npm run zip
```

The output will be named **extension.zip** and **source.zip** in the project folder.

## Install from Store

* [Chrome Extension Store](https://chrome.google.com/webstore/detail/nhddoifhjbelkmbddllomdnblibdanfe)

* [Microsoft Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/detail/pamlkecflcalfeaodohfedfndiealmhm)

* [Firefox Add-ons Store](https://addons.mozilla.org/firefox/addon/video-hotkeys/)

## Extension Features

* Enable video autoplay
* Enable 0.75, 1.25 and 1.75 playback rates for PangziTV
* Enable autohide barrage (danmu) where it's available
* Add common global hotkeys to most popular video streaming websites
* Hide the on-player logo for iQiyi, iQiyi Overseas, Youku and Tencent Video

## Supported Hotkeys

* `D` : Toggle barrage (danmu)
* `<` : Decrease playback rate
* `>` : Increase playback rate
* `F` : Toggle fullscreen
* `M` : Toggle mute
* `SPACE` : Toggle play/pause
* `0..9` : Seek to position 0%-90% in the video
* `J` : Rewind 10 seconds
* `K` : Toggle play/pause
* `L` : Fast forward 10 seconds
* `LEFT` : Rewind 5 seconds
* `RIGHT` : Fast forward 5 seconds
* `UP` : Increase volume by 5%
* `DOWN` : Decrease volume by 5%

## Supported Video Websites

* [Bilibili](https://www.bilibili.com/)
* [iQiyi](https://www.iqiyi.com/)
* [iQiyi Overseas](https://www.iq.com/)
* [PangziTV](https://www.pangzitv.com/)
* [MangoTV](https://w.mgtv.com/)
* [OleVOD](https://www.olevod.com/)
* [Xigua Video](https://www.ixigua.com/)
* [Youku](https://www.youku.com/)
* [Tencent Video](https://v.qq.com/)
* [Sohu TV](https://tv.sohu.com/)
* [AcFun](https://www.acfun.cn/)