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

The output will be named **extension.zip**, **extension-v2.zip** and **source.zip** in the project folder.

## Install from Store

* [Chrome Extension Store](https://chrome.google.com/webstore/detail/nhddoifhjbelkmbddllomdnblibdanfe)

* [Microsoft Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/detail/pamlkecflcalfeaodohfedfndiealmhm)

* [Firefox Add-ons Store](https://addons.mozilla.org/firefox/addon/video-hotkeys/)

## Extension Features

* Enable video autoplay for Bilibili
* Enable 0.75, 1.25, 1.75, 3.0 and 4.0 playback rates for PangziTV and DuBoKu
* Autohide barrage (danmu) where it is available
* Add common global hotkeys to popular video streaming websites
* Hide the on-player logo for iQiyi, iQiyi Overseas, Youku and Tencent Video

## Supported Hotkeys

* `D` : Toggle barrage (danmu)
* `<` : Decrease playback rate
* `>` : Increase playback rate
* `F` : Toggle full screen
* `T` : Toggle theater mode
* `W` : Toggle full web page
* `I` : Toggle miniplayer
* `M` : Toggle mute
* `SPACE` : Toggle play/pause
* `0..9` : Seek to position 0%-90% in the video
* `H` : Rewind 20 seconds
* `J` : Rewind 10 seconds
* `K` : Toggle play/pause
* `L` : Fast forward 10 seconds
* `;` : Fast forward 20 seconds
* `LEFT` : Rewind 5 seconds
* `RIGHT` : Fast forward 5 seconds
* `UP` : Increase volume by 5%
* `DOWN` : Decrease volume by 5%
* `[` : Previous episode
* `]` : Next episode

## Supported Video Websites

* [哔哩哔哩 | Bilibili](https://www.bilibili.com/)
* [爱奇艺 | iQIYI](https://www.iqiyi.com/)
* [爱奇艺海外版 | iQIYI Overseas](https://www.iq.com/)
* [胖子视频 | Pangzi TV](https://www.pangzitv.com/)
* [芒果TV | Mango TV](https://w.mgtv.com/)
* [欧乐影院 | OleVOD](https://www.olevod.com/)
* [欧乐影院 | OleHDTV](https://www.olehdtv.com/)
* [欧乐影院 | OleVOD.eu](https://www.olevod.eu/)
* [西瓜视频 | Xigua Video](https://www.ixigua.com/)
* [优酷 | Youku](https://www.youku.com/)
* [腾讯视频 | Tencent Video](https://v.qq.com/)
* [搜索视频 | Sohu TV](https://tv.sohu.com/)
* [AcFun弹幕视频网 | AcFun Video](https://www.acfun.cn/)
* [独播库 | DuBoKu TV](https://www.duboku.tv/)
* [好看视频 | Haokan Video](https://haokan.baidu.com/)
* [泥视频 | NiVOD](https://www.nivod.tv/)
* [小宝影院 | XiaoHeiMi](https://xiaoheimi.net)
* [SportsNet Video](https://www.sportsnet.ca/videos/)
* [Amazon Video](https://www.amazon.com/aiv)
* [YouTube](https://www.youtube.com/)
