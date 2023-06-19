# 外觀模式 Facade
外觀模式為子系統的一組接口，提供了一個高層接口來簡化複雜系統的使用，使用者直接使用這個高層接口即可。

例如去醫院看病，我們要去不同的地方掛號、找醫生、領藥，非常麻煩，外觀模式就是希望提供一個地方統一處理這些事情。

```
子系統 1 --- ╮
        
子系統 2 --- 統一接口

子系統 3 --- ╯
```

## 媒體播放器
現在有一個多媒體播放器應用程式，其中涉及音頻播放器、視頻播放器和字幕顯示器等多個子系統。

在這種情況下，可以使用外觀模式來建立一個多媒體播放器外觀（MediaPlayerFacade），此類提供了簡化的接口，讓開發者只需要與外觀進行交互，而不需要直接與每個子系統進行互動。

```ts
class AudioPlayer {
  playAudio(file: string): void {
    console.log("播放音頻：" + file);
    // 假設在這裡實現音頻播放邏輯
  }
}

class VideoPlayer {
  playVideo(file: string): void {
    console.log("播放視頻：" + file);
    // 假設在這裡實現視頻播放邏輯
  }
}

class SubtitleDisplay {
  displaySubtitles(file: string): void {
    console.log("顯示字幕：" + file);
    // 假設在這裡實現字幕顯示邏輯
  }
}

class MediaPlayerFacade {
  private audioPlayer: AudioPlayer;
  private videoPlayer: VideoPlayer;
  private subtitleDisplay: SubtitleDisplay;

  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.videoPlayer = new VideoPlayer();
    this.subtitleDisplay = new SubtitleDisplay();
  }

  // 提供統一的播放接口
  playMedia(file: string): void {
    const fileType = this.getFileType(file);

    if (fileType === "audio") {
      this.audioPlayer.playAudio(file);
    } else if (fileType === "video") {
      this.videoPlayer.playVideo(file);
      this.subtitleDisplay.displaySubtitles(file);
    } else {
      console.log("不支援的檔案格式");
    }
  }

  private getFileType(file: string): string {
    // 假設在這裡判斷檔案類型
    // 簡化起見，我們使用檔案名稱的副檔名來判斷
    const extension = file.split(".").pop();
    if (extension === "mp3" || extension === "wav") {
      return "audio";
    } else if (extension === "mp4" || extension === "avi") {
      return "video";
    } else {
      return "unknown";
    }
  }
}

const mediaPlayerFacade = new MediaPlayerFacade();
mediaPlayerFacade.playMedia("audio.mp3");
mediaPlayerFacade.playMedia("video.mp4");
```

這樣就只要跟 `mediaPlayerFacade` 互動，不需要關心底層的邏輯了。

## 瀏覽器兼容性的應用
外觀模式在 JS 還有一個廣為應用的方法，就是一個方法要兼容所有瀏覽器的時候，例如 IE 不支援 addEventListener，而我們又需要設置事件時，就可以使用外觀模式:
```js
function addEvent (dom, type, fn) {
  if (dom.addEventListener) {
    dom.addEventListener(type, fn)
  } else if (dom.attachEvent) {
    dom.attachEvent('on' + type, fn)
  } else {
    dom['on' + type] = fn;
  }
}
```
還有阻止默認行為也可以使用外觀模式

```js
const getEvent = function (event) {
  return event || window.event;
}

const getTarget = function (event) {
  const event = getEvent(event);
  return event.target || event.srcElement
}

const preventDefault = function(event) {
  const event = getEvent(event);
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.retrunValue = false
  }
}

document.onclick = function (e) {
  preventDefault(e);
}
```

## 小結
當一個複雜的系統提供一系列的接口時，會造成使用的複雜，透過外觀模式可以封裝隱藏其複雜性。
但外觀模式不符合單一職責和開放封閉原則，因此需要根據情況謹慎使用，過於濫用可能會造成額外的學習成本。