<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="roomContainer" class="tui-room">
    <div class="header-container header">
      <div class="left-container">
        <div class="user-info-container header-item user-info">
          <div class="user-info-content">
            <img class="avatar" alt="" src="https://imgcache.qq.com/qcloud/public/static/avatar6_100.20191230.png">
            <div class="name">{{ store.userId }}</div>
            <div class="svg-icon medium-icon line-arrow-down down-icon"></div>
          </div>

        </div>
      </div>
      <div class="right-container">
        <div class="network-info-container">
          <div class="network-info-icon" @click="netVisible = !netVisible">
            <div class="network-quality-1"></div>
            <div class="network-quality-2"></div>
            <div class="network-quality-3"></div>
            <div class="network-quality-4"></div>
          </div>
          <!-- <div v-if="netVisible" class="network-info-board">
            <div class="network-state">网络状态未知</div>
            <div class="network-detail-item"><span>网络延迟：</span><span>0 ms</span></div>
            <div class="network-detail-item"><span>帧率：</span><span>0 fps</span></div>
            <div class="network-detail-item"><span>码率：</span><span>0 Kbps</span></div>
          </div> -->
        </div>

      </div>
    </div>
    <div class="content-container content">
      <div class="stream-container-flatten">
        <div class="enlarged-stream-container" style="display: none;">

        </div>
        <div class="stream-list-container">
          <div class="stream-list">
            <div :class="{ 'user-stream-container': true, 'single-stream': store.remoteStreams.length === 0 }">
              <div id="stream_main" class="stream-region"></div>
              <div v-if="!videoMuted" class="center-user-info-container">
                <img class="avatar-region" alt=""
                  src="https://imgcache.qq.com/qcloud/public/static/avatar6_100.20191230.png">
              </div>
              <!-- <div class="corner-user-info-container">

                <div class="audio-icon-container small">
                  <div class="audio-level">
                    <div class="audio-level-item audio-level-item false"></div>
                  </div>
                  <div class="svg-icon large-icon mic-off audio-icon"></div>
                </div>
                <span class="user-name">{{ store.userId }}</span>
              </div> -->
            </div>
            <div v-if="store.remoteStreams.length > 0" class="right-stream-container">
              <template v-for='item in store.remoteStreams' :key='item.getId()'>
                <div :id='item.getId()' class="stream-region"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-container footer">
      <div class="left-container">
        <div class="audio-control-container">
          <div class="icon-box hover-effect false" show-more="false">
            <span @click="handleMicrophone" class="icon-content">
              <template v-if="!audioMuted">
                <div class="audio-icon-container false">
                  <div class="audio-level">
                    <div v-for="(item, index) in new Array(5).fill('')" :key="index"
                      :class="['audio-level-item', `${isTestingMicrophone && volumeNum > index ? 'false' : ''}`]">
                    </div>
                  </div>
                  <div class="svg-icon large-icon mic-off audio-icon"></div>
                </div>
              </template>
              <template v-else>
                <div class="svg-icon large-icon mic-on audio-icon"></div>
              </template>
              <span class="title">麦克风</span>
            </span>
            <span class="icon-arrow">
              <div class="svg-icon small-icon arrow-up arrow"></div>
            </span>
          </div>
        </div>
        <div class="video-control-container">
          <div v-if="videoMuted" @click="cameraClose" class="icon-box hover-effect false"><span class="icon-content">
              <div class="svg-icon large-icon camera-on"></div>
              <span class="title">摄像头</span>
            </span>
            <span class="icon-arrow">
              <div class="svg-icon small-icon arrow-up arrow"></div>
            </span>
          </div>
          <div v-else @click="cameraOpen" class="icon-box hover-effect false"><span class="icon-content">
              <div class="svg-icon large-icon camera-off"></div>
              <span class="title">摄像头</span>
            </span>
            <span class="icon-arrow">
              <div class="svg-icon small-icon arrow-up arrow"></div>
            </span>
          </div>
        </div>
      </div>
      <div class="center-container">
        <div class="screen-share-control-container" @click="handleStartShare">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div class="svg-icon large-icon screen-share"></div><span class="title">共享屏幕</span>
            </span>
          </div>
        </div>
        <div v-if="fullscreen" class="fullscreen-control-container" @click="handleExitFullScreen()">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div class="svg-icon large-icon exit-full-screen"></div><span class="title">退出全屏</span>
            </span>
          </div>
        </div>
        <div v-else class="fullscreen-control-container" @click="handleFullScreen()">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div class="svg-icon large-icon full-screen"></div><span class="title">全屏</span>
            </span>
          </div>
        </div>
        <div class="invite-control-container" @click="inviteShow">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div v-if="inviteVisible" class="svg-icon large-icon invite-active"></div>
              <div v-else class="svg-icon large-icon invite"></div>
              <span class="title">邀请成员</span>
            </span>
          </div>
        </div>

        <div class="more-control-container" @click="moreShow">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div v-if="moreVisible" class="svg-icon large-icon more-active"></div>
              <div v-else class="svg-icon large-icon more"></div>
              <span class="title">更多</span>
            </span>
          </div>
        </div>
        <div class="setting-control-container" @click="settingShow">
          <div class="icon-box hover-effect false"><span class="icon-content">
              <div v-if="settingVisible" class="svg-icon large-icon setting-active"></div>
              <div v-else class="svg-icon large-icon setting"></div>
              <span class="title">设置</span>
            </span>

          </div>
        </div>
      </div>
      <div class="right-container">
        <div @click="handleLeave" class="end-button">结束群聊</div>
      </div>
    </div>
    <div class="sidebar-container">
      <el-drawer :modal="false" size="480px" custom-class="room-sidebar" :title="drawerTitle" v-model="drawerVisible"
        :before-close="beforeClose">
        <div v-if="inviteVisible" class="invite-container">
          <div class="invite-notice">您可以通过复制房间号或者邀请链接的方式邀请更多人加入房间</div>
          <div class="invite-content">
            <div class="invite-item"><span class="invite-title">通过房间号邀请</span>
              <div class="input-area">
                <input class="input" v-model="roomValue" type="text">
                <div @click="copy(roomValue)" class="svg-icon large-icon copy-icon copy"></div>
              </div>
            </div>
            <div class="invite-item"><span class="invite-title">通过房间链接邀请</span>
              <div class="input-area">
                <input class="input" v-model="linkValue" type="text">
                <div @click="copy(linkValue)" class="svg-icon large-icon copy-icon copy"></div>
              </div>
            </div>
            <div class="invite-item"><span class="invite-title">通过客户端 scheme
                邀请</span>
              <div class="input-area">
                <input v-model="schemeValue" class="input" type="text">
                <div @click="copy(schemeValue)" class="svg-icon large-icon copy-icon copy"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="moreVisible" class="more-container">
          <div class="more-notice">如果有任何问题欢迎加入我们的QQ群或者发送邮件</div>
          <div class="more-content">
            <div class="more-item"><span class="more-title">QQ群</span>
              <div class="input-area">
                <input class="input" v-model="groupValue" type="text">
                <div @click="copy(groupValue)" class="svg-icon large-icon copy-icon copy"></div>
              </div>
            </div>
            <div class="more-item"><span class="more-title">邮箱地址</span>
              <div class="input-area">
                <input class="input" v-model="emailValue" type="text">
                <div @click="copy(emailValue)" class="svg-icon large-icon copy-icon copy"></div>
              </div>
            </div>
          </div>
        </div>
      </el-drawer>

    </div>

    <div v-if="settingVisible" class="setting-dialog">
      <div class="dialog-tabs"><span class="dialog-title">设置</span>
        <div @click="cameraTestClose" :class="cameraTestVisible ? 'tabs-title' : 'tabs-title active'">声音设置</div>
        <div @click="cameraTestOpen" :class="cameraTestVisible ? 'tabs-title active' : 'tabs-title'">摄像头设置</div>
      </div>
      <div class="dialog-content">
        <div v-if="cameraTestVisible" class="video-tab">
          <div class="item-setting-container">
            <div class="item-setting"><span class="title">摄像头</span>
              <el-select class="detail-select" v-model='store.videoDeviceId' placeholder='Camera'
                @change='handleCameraChange'>
                <el-option v-for='item in store.cameraList' :key='item.deviceId' :label='item.label'
                  :value='item.deviceId'>
                </el-option>
              </el-select>
            </div>
            <div class="item-setting"><span class="title">视频画面</span>
              <div id="video-preview" class="video-preview">
              </div>
            </div>
          </div>
        </div>
        <div v-else class="audio-setting-tab">
          <div class="item-setting-container">
            <div class="item-setting"><span class="title">麦克风</span>
              <div class="flex">
                <el-select class="detail-select" v-model='store.audioDeviceId' placeholder='Microphone'
                  @change='handleMicChange'>
                  <el-option v-for='item in store.microphoneList' :key='item.deviceId' :label='item.label'
                    :value='item.deviceId'>
                  </el-option>
                </el-select>
                <div class="button" @click="handleMicrophoneTest">
                  {{ isTestingMicrophone ? '停止测试' : '测试' }}
                </div>
                <audio id="audioTest"></audio>
              </div>
            </div>
            <div class="item-setting"><span class="title">输出</span>
              <div class="mic-bar-container">
                <div v-for="(item, index) in new Array(36).fill('')" :key="index"
                  :class="['mic-bar', `${isTestingMicrophone && volumeNum > index ? 'active' : ''}`]">
                </div>
              </div>
            </div>
          </div>
          <div class="item-setting-container">
            <div class="item-setting"><span class="title">扬声器</span>
              <div class="flex">
                <el-select class="detail-select" v-model='store.speakerDeviceId' placeholder='speake'
                  @change='handleSpeakerChange'>
                  <el-option v-for='item in store.speakerList' :key='item.deviceId' :label='item.label'
                    :value='item.deviceId'>
                  </el-option>
                </el-select>
                <div class="button" @click="handleSpeakerTest">
                  {{ isTestingSpeaker ? '停止测试' : '测试' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="svg-icon medium-icon close close-icon" @click="settingClose"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref, onMounted, inject, nextTick,
} from 'vue';
import TRTC from 'trtc-js-sdk';
import type { Client, LocalStream } from 'trtc-js-sdk';
import { ElMessage } from 'element-plus/es';
import appStore from '@/store/index';
import type { DeviceItem } from '@/types/type';
import ShareClient from '@/utils/shareClient';
import { copyText } from 'vue3-clipboard';
import router from '@/router';

const videoMuted = ref(false);
const cameraTestVisible = ref(false);
const isTestingMicrophone = ref(false);
const drawerVisible = ref(false);
const settingVisible = ref(false);
const inviteVisible = ref(false);
const moreVisible = ref(false);
const fullscreen = ref(false);
const netVisible = ref(false);
const drawerTitle = ref<string>();
const groupValue = ref('592465424');
const emailValue = ref('tylerding@tencent.com');
const roomValue = ref('0');
const linkValue = ref('https://web.sdk.qcloud.com/component/tuiroom/index.html#/home?roomId=0');
const schemeValue = ref('tuiroom://joinroom?roomId=0');
let testStream: LocalStream;
let audioStream: LocalStream;
let timer: any;
let shareClient: any;
let localClient: Client;
let localStream: LocalStream;

const isTestingSpeaker = ref(false);
const audioPlayer = document.createElement('audio');
const volumeNum = ref(0);
const store = appStore();
const $bus = inject('$bus');
const $aegis: any = inject('$aegis');
const audioMuted = ref(false);
const inviteLink = ref<string>();

onMounted(() => {
  handleJoin();
});

($bus as any).on('stream-subscribed', async (event: any) => {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  const userId = remoteStream.getUserId();
  const remoteId = `${id}`;
  store.remoteStreams.push(remoteStream);
  await nextTick();
  remoteStream.play(remoteId).then(() => {
    store.addSuccessLog(`RemoteStream play success: [${userId}]`);
  }).catch((error: any) => {
    store.addFailedLog(`RemoteStream play failed: [${userId}], error: ${error.message_}`);
  });

  console.log('stream-subscribed ID: ', id);
});

($bus as any).on('stream-removed', (event: any) => {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  store.remoteStreams = store.remoteStreams.filter((stream: any) => stream.getId() !== id);
});

const updateDevice = async () => {
  console.log('updateDevice');
  const cameraItems: DeviceItem[] = await TRTC.getCameras();
  cameraItems.forEach((item) => { item.value = item.deviceId; });
  const speakerItems: DeviceItem[] = await TRTC.getSpeakers();
  speakerItems.forEach((item) => { item.value = item.deviceId; });
  const microphoneItems: DeviceItem[] = await TRTC.getMicrophones();
  microphoneItems.forEach((item) => { item.value = item.deviceId; });

  store.$patch({
    cameraList: cameraItems,
    microphoneList: microphoneItems,
    speakerList: speakerItems,
  });

  if (!store.videoDeviceId) {
    store.videoDeviceId = cameraItems[0].deviceId;
  }

  if (!store.speakerDeviceId) {
    store.speakerDeviceId = speakerItems[0].deviceId;
  }

  if (!store.audioDeviceId) {
    store.audioDeviceId = microphoneItems[0].deviceId;
  }
};

navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
  stream.getTracks().forEach((track) => { track.stop(); });
  updateDevice();
})

navigator.mediaDevices.ondevicechange = updateDevice;

// 设备切换
const handleCameraChange = (id: any) => {
  switchDevice(id, 'camera')
};

// 设备切换
const handleMicChange = (id: any) => {
  switchDevice(id, 'mic')
};

// 设备切换
const handleSpeakerChange = (id: any) => {
  store.speakerDeviceId = id
};

async function switchDevice(id: string, name: string) {
 
  switch (name) {
    case 'camera':
      try {
        await testStream.switchDevice('video', id);
        addSuccessLog('LocalStream switch video device success');
      } catch (error: any) {
        addFailedLog('Switch video device failed');
      }
      break;
    case 'mic':
      try {
        await testStream.switchDevice('audio', id);
        addSuccessLog('LocalStream switch audio device success');
      } catch (error: any) {
        addFailedLog('Switch audio device failed');
      }
      break;
  }

}

// 点击麦克风
async function handleMicrophone() {
  if (!audioMuted.value) {
    audioMuted.value = true;
    localStream.muteAudio();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timer = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      volumeNum.value = localStream.getAudioLevel() * 100;
    }, 500);
  } else {
    audioMuted.value = false;
    clearInterval(timer);
    volumeNum.value = 0;
    localStream.unmuteAudio();
  }
}

async function cameraOpen() {
  videoMuted.value = true;
  localStream.unmuteVideo();
  // await localStream.play('stream_main');
  // await createLocalStream();
  // await handlePublish();
}

// 点击摄像头测试开始
async function cameraTestOpen() {
  testStream = TRTC.createStream({
    video: true,
    audio: false,
    cameraId: store.videoDeviceId,
  });

  cameraTestVisible.value = true;
  await testStream.initialize();
  testStream.play('video-preview');
}

// 点击摄像头关闭
async function cameraClose() {
  videoMuted.value = false;
  localStream.muteVideo();
  // await handleUnpublish();
}

// 点击摄像头测试关闭
function cameraTestClose() {
  cameraTestVisible.value = false;
  testStream.close();
}

// 点击扬声器【测试】按钮
function handleSpeakerTest() {
  if (isTestingSpeaker.value) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isTestingSpeaker.value = false;
  } else {
    isTestingSpeaker.value = true;
    audioPlayer.src = 'https://web.sdk.qcloud.com/trtc/electron/download/resources/media/TestSpeaker.mp3';
    audioPlayer.play();
  }
}

// 点击麦克风【测试】按钮
async function handleMicrophoneTest() {
  if (!isTestingMicrophone.value) {
    isTestingMicrophone.value = true;
    audioStream = TRTC.createStream({
      video: false,
      audio: true,
      microphoneId: store.audioDeviceId,
    });
    await audioStream.initialize();
    audioStream.play('roomContainer');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timer = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      volumeNum.value = audioStream.getAudioLevel() * 100;
    }, 500);
  } else {
    isTestingMicrophone.value = false;
    clearInterval(timer);
    volumeNum.value = 0;
    audioStream.close();
  }
}

// 成功提示
const addSuccessLog = (str: string) => {
  store.logs.push({
    type: 'success',
    content: str,
  });
};

// 失败提示
const addFailedLog = (str: string) => {
  store.logs.push({
    type: 'failed',
    content: str,
  });
};

// 屏幕共享
async function handleStartShare() {
  shareClient = new ShareClient({
    sdkAppId: parseInt(store.sdkAppId, 10),
    userId: store.userId,
    roomId: parseInt(store.roomId, 10),
    secretKey: store.secretKey,
  });
  try {
    await shareClient.join();
    await shareClient.publish();
    addSuccessLog('Start share screen success');
    store.isShared = true;
  } catch (error: any) {
    addFailedLog(`Start share error: ${error.message_}`);
  }
}

// 弹窗隐藏
function beforeClose() {
  inviteVisible.value = false;
  moreVisible.value = false;
  drawerVisible.value = false;
}

// 显示邀请界面
function inviteShow() {
  inviteVisible.value = true;
  drawerVisible.value = true;
  drawerTitle.value = '邀请成员';
}

// 显示联系我们界面
function moreShow() {
  drawerVisible.value = true;
  moreVisible.value = true;
  drawerTitle.value = '联系我们';
}

// 显示设置界面
function settingShow() {
  settingVisible.value = true;
}

// 退出全屏
function handleExitFullScreen() {
  const doc = document as any
  if (doc.exitFullscreen) { // W3C标准
    doc.exitFullscreen();
  } else if (doc.webkitCancelFullScreen) { // Chrome
    doc.webkitCancelFullScreen();
  } else if (doc.mozCancelFullScreen) { // firefox
    doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) { // IE
    doc.msExitFullscreen();
  }
  fullscreen.value = false;
}

// 全屏
function handleFullScreen() {
  let element: any;
  element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else {
    alert('当前浏览器不支持全屏显示！');
  }
  fullscreen.value = true;
}

// 复制文本
function copy(text: any) {
  copyText(text, undefined, (error: any) => {
    if (error) {
      ElMessage({ message: '复制失败', type: 'error' });
    } else {
      ElMessage({ message: '复制成功!', type: 'success' });
    }
  });
}

// 设置界面关闭
function settingClose() {
  settingVisible.value = false;
  cameraTestClose();
}

async function createLocalStream() {
  try {
    localStream = TRTC.createStream({
      userId: store.userId,
      audio: true,
      video: true,
      cameraId: store.videoDeviceId,
      microphoneId: store.audioDeviceId,
    });
    localStream.setVideoProfile('480p');
    videoMuted.value = true;
    audioMuted.value = true;
    await localStream.initialize();
    addSuccessLog(`LocalStream [${store.userId}] initialized`);
    localStream.play('stream_main').then(() => {
      addLocalControlView();
      addSuccessLog(`LocalStream [${store.userId}] playing`);
    }).catch((e) => {
      addFailedLog(`LocalStream [${store.userId}] failed to play. Error: ${e.message_}`);
    });
  } catch (error: any) {
    addFailedLog(`LocalStream failed to initialize. Error: ${error.message_}`);
  }
}

async function handleJoin() {
  const userSig = store.getUserSig();
  try {
    localClient = TRTC.createClient({
      mode: 'rtc', sdkAppId: parseInt(store.sdkAppId, 10), userId: store.userId, userSig,
    });
    addSuccessLog(`Client [${store.userId}] created`);
    installEventHandlers();
    await localClient.join({ roomId: parseInt(store.roomId, 10) });
    store.isJoined = true;
    inviteLink.value = store.createShareLink();
    addSuccessLog(`Join room [${store.roomId}] success`);
    $aegis.reportEvent({
      name: 'joinRoom',
      ext1: 'joinRoom-success',
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  } catch (error: any) {
    addFailedLog(`Join room ${store.roomId} failed, please check your params. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: 'joinRoom',
      ext1: `joinRoom-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  }

  await createLocalStream();
  await handlePublish();
}

async function handlePublish() {
  if (!store.isJoined) {
    ElMessage({ message: 'call publish()- please join() firstly', type: 'warning' });
    return;
  }
  if (store.isPublished) {
    ElMessage({ message: 'duplicate publish() observed', type: 'warning' });
    return;
  }

  try {
    await localClient.publish(localStream);
    addSuccessLog('LocalStream is published successfully');
    store.isPublished = true;
    $aegis.reportEvent({
      name: 'publish',
      ext1: 'publish-success',
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  } catch (error: any) {
    addFailedLog(`LocalStream is failed to publish. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: 'publish',
      ext1: `publish-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  }
}

async function handleUnpublish() {
  if (!store.isJoined) {
    ElMessage({ message: 'unpublish() - please join() firstly', type: 'warning' });
    return;
  }
  if (!store.isPublished) {
    ElMessage({ message: 'call unpublish() - you have not published yet', type: 'warning' });
    return;
  }
  try {
    await localClient.unpublish(localStream);
    store.isPublished = false;
    addSuccessLog('Unpublish localStream success');
    $aegis.reportEvent({
      name: 'unpublish',
      ext1: 'unpublish-success',
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  } catch (error: any) {
    addFailedLog(`LocalStream is failed to unpublish. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: 'unpublish',
      ext1: `unpublish-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  }
}

async function handleLeave() {
  if (!store.isJoined) {
    ElMessage({ message: 'leave() - please join() firstly', type: 'warning' });
    return;
  }
  if (store.isPublished) {
    await handleUnpublish();
  }
  try {
    uninstallEventHandlers();
    await localClient.leave();
    store.isJoined = false;
    addSuccessLog('Leave room success');
    if (localStream) {
      localStream.stop();
      localStream.close();
      localStream = null;
      router.push({ path: '/' });
    }
    $aegis.reportEvent({
      name: 'leaveRoom',
      ext1: 'leaveRoom-success',
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  } catch (error: any) {
    addFailedLog(`Leave room failed. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: 'leaveRoom',
      ext1: `leaveRoom-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: 'webrtcQuickDemoVue3',
      ext3: store.sdkAppId,
    });
  }
}

function addLocalControlView() {
  console.log('addLocalControlView');
}

function installEventHandlers() {
  if (!localClient) {
    return;
  }
  localClient.on('error', handleError);
  localClient.on('client-banned', handleBanned);
  localClient.on('peer-join', handlePeerJoin);
  localClient.on('peer-leave', handlePeerLeave);
  localClient.on('stream-added', handleStreamAdded);
  localClient.on('stream-subscribed', handleStreamSubscribed);
  localClient.on('stream-removed', handleStreamRemoved);
  localClient.on('stream-updated', handleStreamUpdated);
  localClient.on('mute-video', handleMuteVideo);
  localClient.on('mute-audio', handleMuteAudio);
  localClient.on('unmute-video', handleUnmuteVideo);
  localClient.on('unmute-audio', handleUnmuteAudio);
}

function handleMuteVideo(event: any) {
  addSuccessLog(`[${event.userId}] mute video`);
}

function handleMuteAudio(event: any) {
  addSuccessLog(`[${event.userId}] mute audio`);
}

function handleUnmuteVideo(event: any) {
  addSuccessLog(`[${event.userId}] unmute video`);
}

function handleUnmuteAudio(event: any) {
  addSuccessLog(`[${event.userId}] unmute audio`);
}

function handleError(error: any) {
  ElMessage({ message: `LocalClient error: ${error.message_}`, type: 'error' });
  addSuccessLog(`LocalClient error: ${error.message_}`);
}

function handleBanned(event: any) {
  ElMessage({ message: `Client has been banned for ${event.reason}`, type: 'warning' });
  addSuccessLog(`Client has been banned for ${event.reason}`);
}

function handlePeerJoin(event: any) {
  const { userId } = event;
  if (userId !== 'local-screen') {
    addSuccessLog(`Peer Client [${userId}] joined`);
  }
}

function handlePeerLeave(event: any) {
  const { userId } = event;
  if (userId !== 'local-screen') {
    addSuccessLog(`[${userId}] leave`);
  }
}

function handleStreamAdded(event: any) {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  const userId = remoteStream.getUserId();

  if (remoteStream.getUserId() === `share_${store.userId}`) {
    // don't need to screen shared by us
    localClient.unsubscribe(remoteStream).catch((error: any) => {
      addFailedLog(`unsubscribe failed: ${error.message_}`);
    });
  } else {
    addSuccessLog(`remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`);
    localClient.subscribe(remoteStream).catch((error: any) => {
      addFailedLog(`subscribe failed: ${error.message_}`);
      $aegis.reportEvent({
        name: 'subscribe',
        ext1: `subscribe-failed#${store.roomId}*${store.userId}*${error.message_}`,
        ext2: 'webrtcQuickDemoVue3',
        ext3: store.sdkAppId,
      });
    });
  }
}

function handleStreamSubscribed(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(`RemoteStream subscribed: [${userId}]`);
  ($bus as any).emit('stream-subscribed', event);
  $aegis.reportEvent({
    name: 'subscribe',
    ext1: 'subscribe-success',
    ext2: 'webrtcQuickDemoVue3',
    ext3: store.sdkAppId,
  });
}

function handleStreamRemoved(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(`RemoteStream removed: [${userId}]`);
  ($bus as any).emit('stream-removed', event);
}

function handleStreamUpdated(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(`RemoteStream updated: [${userId}] audio:${remoteStream.hasAudio()} video:${remoteStream.hasVideo()}`);
}

function uninstallEventHandlers() {
  if (!localClient) {
    return;
  }
  localClient.off('error', handleError);
  localClient.off('error', handleError);
  localClient.off('client-banned', handleBanned);
  localClient.off('peer-join', handlePeerJoin);
  localClient.off('peer-leave', handlePeerLeave);
  localClient.off('stream-added', handleStreamAdded);
  localClient.off('stream-subscribed', handleStreamSubscribed);
  localClient.off('stream-removed', handleStreamRemoved);
  localClient.off('stream-updated', handleStreamUpdated);
  localClient.off('mute-video', handleMuteVideo);
  localClient.off('mute-audio', handleMuteAudio);
  localClient.off('unmute-video', handleUnmuteVideo);
  localClient.off('unmute-audio', handleUnmuteAudio);
}

</script>
<!-- <style>
:root {
  --el-font-size-extra-large: 20px;
  --el-color-primary: #006EFF !important;
  --el-fill-color-light: #2E323D !important;
  --el-fill-color-blank: #2E323D !important;
  --el-border-color: #2E323D !important;
  --el-border-color-light: #2E323D !important;
  --el-bg-color: #1D2029 !important;
  --el-bg-color-page: #ffffff !important;
  --el-bg-color-overlay: #1D2029 !important;
  --el-text-color-primary: #CFD4E6;
  --el-text-color-regular: #7C85A6;
  --el-slider-height: 4px !important;
  --el-slider-button-size: 12px !important;
  --el-dialog-bg-color: #1D2029 !important;
  --el-dialog-box-shadow: 0 1px 10px 0 rgba(0, 0, 0, .3) !important;
}
</style> -->
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  user-select: none;
  font-family: century-gothic, sans-serif;
  overflow: auto;
  touch-action: manipulation;
}

.medium-icon {
  width: 20px;
  height: 20px;
}

.large-icon {
  width: 32px;
  height: 32px;
}

.svg-icon {
  overflow: hidden;
  display: inline-block;
  background-size: contain;
}

.line-arrow-down {
  /* background: url(./arrow-border-down.4d9a2050.svg);*/
}

.tui-room {
  width: 100%;
  height: 100%;
  position: relative;
}

.tui-room:hover .header-container {
  display: block
}

.tui-room:hover .footer-container {
  display: flex
}

.tui-room .header {
  width: 100%;
  height: 48px;
  background-color: #1d2029;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: none;
}

.header-container {
  width: 100%;
  height: 100%;
  padding-left: 9px;
  padding-right: 24px;
  position: relative;
}

.tui-room * {
  color: #b3b8c8;
  box-sizing: border-box;
  text-align: start;
  user-select: none;
}

.header-container .left-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.header-container .left-container .user-info-container {
  position: relative;
}

.header-container .left-container .user-info-container .user-info-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-container .left-container .user-info-container .user-info-content .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.header-container .left-container .user-info-container .user-info-content .name {
  max-width: 100px;
  margin-left: 20px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-container .left-container .user-info-container .user-info-content .down-icon {
  margin-left: 4px;
}

.header-container .right-container {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  float: right;
  padding-right: 24px;
  display: flex;
  align-items: center;
}

.network-info-container {
  position: relative;
  width: 20px;
  height: 20px;
}

.network-info-container .network-info-icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 4px 2px;
  cursor: pointer;
}

.network-info-container .network-info-icon div {
  width: 3px;
  background-color: #cfd4e6;
  border-radius: 4px;
}

.network-info-container .network-info-icon .network-quality-1 {
  height: 5px;
}

.network-info-container .network-info-icon .network-quality-2 {
  height: 7px;
}

.network-info-container .network-info-icon .network-quality-3 {
  height: 9.5px;
}

.network-info-container .network-info-icon .network-quality-4 {
  height: 12px;
}

.network-info-container .network-info-board {
  position: absolute;
  top: 47px;
  right: 0;
  background-color: #1d2029;
  box-shadow: 0 1px 10px #0000004d;
  border-radius: 4px;
  width: 263px;
  height: 186px;
  padding: 32px;
}

.network-info-container .network-info-board .network-state {
  margin-bottom: 18px;
}

.network-info-container .network-info-board .network-detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* 内容开始 */
.tui-room .content {
  width: 100%;
  height: 100%;
  background-color: #0d0f15;
}

.content-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.stream-container-flatten {
  width: 100%;
  height: 100%;
  background-color: #0d0f15;
  overflow: hidden;
}

.stream-container-flatten .stream-list-container {
  width: 100%;
  height: 100%;
}

.stream-container-flatten .stream-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: row;
}


.user-stream-container {
  position: relative;
  width: calc(100% - 240px);
  height: 100%;
  flex: 1;
}

.stream-container-flatten .stream-list .single-stream {
  padding: 4px;
  width: 100% !important;
}

.right-stream-container {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: unset;
  width: 240px;
  height: 100%;
}

.right-stream-container .stream-region {
  width: 100%;
}

.user-stream-container .stream-region {
  width: 100%;
  height: 100%;
}

.user-stream-container .center-user-info-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d0f15;
}


.right-stream-container .center-user-info-container .avatar-region {
  width: 130px;
  height: 130px;
  border-radius: 50%;
}

.user-stream-container .center-user-info-container .avatar-region {
  width: 130px;
  height: 130px;
  border-radius: 50%;
}

.user-stream-container .corner-user-info-container {
  position: absolute;
  bottom: 84px;
  left: 0;
  min-width: 118px;
  max-width: 100%;
  overflow: hidden;
  height: 30px;
  display: flex;
  background: rgba(0, 0, 0, .6);
  color: #fff;
  align-items: center;
  align-content: center;
  padding: 0 10px 0 0;
  font-size: 14px;
}

.audio-icon-container.small {
  transform: scale(.8);
}

.user-stream-container .corner-user-info-container>* {
  margin-left: 8px;
}

.audio-icon-container {
  position: relative;
  width: 32px;
  height: 32px;
}

.audio-icon-container .audio-level {
  position: absolute;
  top: 4px;
  left: 11px;
  width: 10px;
  height: 16px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
  overflow: hidden;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 2px;
}

.audio-icon-container .audio-icon {
  position: absolute;
}

.mic-off {
  background: url("@/assets/svg/mic.svg");
}

.mic-on {
  background: url("@/assets/svg/mic-on.svg");
}

.arrow-up {
  background: url("@/assets/svg/arrow-up.svg");
}

.camera-on {
  background: url("@/assets/svg/camera-on.svg");
}

.camera-off {
  background: url("@/assets/svg/camera.svg");
}

.audio-icon-container .audio-level .audio-level-item {
  width: 100%;
  height: 2px;
  border-radius: 50%;
}

/* 内容结束 */

.tui-room .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #1d2029;
}

.footer-container {
  width: 100%;
  height: 100%;
  padding-left: 9px;
  padding-right: 24px;
  justify-content: space-between;
  display: none;
}

.footer-container .left-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.audio-control-container {
  position: relative;
}

.icon-box {
  width: 78px;
  height: 80px;
  position: relative;
  display: flex;
  cursor: pointer;
  padding: 10px 0;
}

.icon-box.hover-effect:hover:before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 78px;
  height: 18px;
  opacity: .59;
  background: rgba(27, 93, 172, .85);
  filter: blur(16px);
}

.icon-box.hover-effect:hover:after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 78px;
  height: 3px;
  background: #1883FF;
}

.audio-control-container .audio-tab {
  position: absolute;
  top: -274px;
  left: 15px;
  width: 320px;
  height: 264px;
  background: #1D2029;
  padding: 20px;
}

.icon-box .icon-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.icon-box .icon-content .title {
  font-size: 12px;
}

.icon-box .icon-arrow {
  position: absolute;
  right: 0;
  top: 8px;
  width: 12px;
  height: 64px;
}

.audio-setting-tab {
  border-radius: 4px;
  font-size: 14px;
}

.footer-container .left-container>:not(:first-child) {
  margin-left: 1rem;
}

.footer-container .center-container {
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}

.footer-container .center-container .screen-share {
  background: url("@/assets/svg/screen-share.svg");
}

.footer-container .center-container .full-screen {
  background: url("@/assets/svg/full-screen.svg");
}

.footer-container .center-container .exit-full-screen {
  background: url("@/assets/svg/exit-fullscreen.svg");
}

.footer-container .center-container .manage-member {
  background: url("@/assets/svg/manage-member.svg");
}

.footer-container .center-container .invite {
  background: url("@/assets/svg/invite.svg");
}

.footer-container .center-container .invite-active {
  background: url("@/assets/svg/invite-active.svg");
}

.footer-container .center-container .chat {
  background: url("@/assets/svg/chat.svg");
}

.footer-container .center-container .chat-active {
  background: url("@/assets/svg/chat-active.svg");
}

.footer-container .center-container .more {
  background: url("@/assets/svg/more.svg");
}

.footer-container .center-container .more-active {
  background: url("@/assets/svg/more-active.svg");
}

.footer-container .center-container .setting {
  background: url("@/assets/svg/setting.svg");
}

.footer-container .center-container .setting-active {
  background: url("@/assets/svg/setting-active.svg");
}

.footer-container .right-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.end-button {
  width: 90px;
  height: 40px;
  border: 2px solid #FF2E2E;
  border-radius: 4px;
  font-weight: 400;
  font-size: 14px;
  color: #ff2e2e;
  letter-spacing: 0;
  cursor: pointer;
  text-align: center;
  line-height: 36px;
}

.end-button:hover {
  background-color: #ff2e2e;
  color: #fff;
}

.sidebar-container>div {
  inset: inherit !important;
  width: 480px !important;
  right: 0 !important;
  top: 0 !important;
  height: 100%;
  position: absolute !important;
}

.sidebar-container :deep(.el-drawer) {
  background-color: #1d2029;
  pointer-events: auto;
}

.sidebar-container :deep(.el-drawer__header) {
  height: 88px;
  border-bottom: 1px solid #2f313b;
  box-sizing: border-box;
  margin-bottom: 0;
  font-size: 20px;
  color: #b3b8c8;
  font-weight: 500;
  padding: 32px 22px 32px 32px;
}

.sidebar-container :deep(.el-drawer__close-btn) {
  border: none;
  cursor: pointer;
  font-size: var(--el-font-size-extra-large);
  color: inherit;
  background-color: transparent;
  outline: none;
}

.sidebar-container :deep(.el-drawer__body) {
  padding: 0;
}

.invite-container {
  padding: 20px 32px;
}

.invite-container .invite-notice {
  font-size: 14px;
  width: 100%;
  height: 22px;
  line-height: 22px;
  font-weight: 400;
  color: #7c85a6;
  font-family: PingFangSC-Regular;
}

.invite-container .invite-content {
  width: 100%;
  margin-top: 20px;
}

.invite-content .invite-item:not(:first-child) {
  margin-top: 20px;
}

.invite-content .invite-item .invite-title {
  font-size: 14px;
  color: #cfd4e6;
  width: 100%;
}

.invite-content .invite-item .input-area {
  margin-top: 10px;
  position: relative;
}

.invite-content .invite-item .input-area .input {
  -webkit-appearance: none;
  background-color: #2e323d;
  background-image: none;
  border-radius: 2px;
  border: 1px solid #2E323D;
  box-sizing: border-box;
  color: #7c85a6;
  display: inline-block;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 40px 0 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 416px;
}

.invite-content .invite-item .input-area .copy {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.more-container {
  padding: 20px 32px;
}

.more-container .more-notice {
  font-size: 14px;
  width: 100%;
  height: 22px;
  line-height: 22px;
  font-weight: 400;
  color: #7c85a6;
  font-family: PingFangSC-Regular;
}

.more-container .more-content {
  width: 100%;
  margin-top: 20px;
}

.more-content .more-item .more-title {
  font-size: 14px;
  color: #cfd4e6;
  width: 100%;
}

.more-content .more-item .input-area {
  margin-top: 10px;
  position: relative;
}

.more-content .more-item:not(:first-child) {
  margin-top: 20px;
}

.more-content .more-item .input-area .input {
  -webkit-appearance: none;
  background-color: #2e323d;
  background-image: none;
  border-radius: 2px;
  border: 1px solid #2E323D;
  box-sizing: border-box;
  color: #7c85a6;
  display: inline-block;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 40px 0 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 416px;
}

.more-content .more-item .input-area .copy {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.copy-icon {
  background-image: url("@/assets/svg/copy-icon.svg");
}

.chat-container {
  position: relative;
  height: 100%;
}

.message-list-container {
  height: calc(100% - 188px);
  padding: 10px 23px 10px 32px;
  overflow: auto;
}

.chat-editor {
  height: 188px;
  background: #2E323D;
  box-sizing: border-box;
}

.chat-editor textarea {
  height: 138px;
  color: #fff;
  width: 100%;
  background: #2E323D;
  border: none;
  box-sizing: border-box;
  padding: 12px 14px;
  caret-color: #fff;
  resize: none;
}

.chat-editor textarea:focus-visible {
  outline: none;
}

.chat-editor .chat-editor-toolbar {
  height: 44px;
  padding: 0 14px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.emoji {
  background-image: url("@/assets/svg/emoji.svg");
}

.chat-editor .send-btn {
  padding: 6px 18px;
  background: #3D4352;
  border-radius: 2px;
  font-size: 14px;
  color: #cfd4e6;
}

.chat-editor .send-btn:hover {
  cursor: pointer;
  background: #006EFF;
  color: #fff;
}

.setting-dialog {
  width: 660px;
  height: 574px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  background-color: #1d2029;
}

.setting-dialog .dialog-tabs {
  width: 194px;
  height: 574px;
  background-color: #0003;
}

.setting-dialog .dialog-tabs .dialog-title {
  display: inline-block;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  margin: 32px 0 20px 32px;
}

.setting-dialog .dialog-tabs .tabs-title {
  width: 100%;
  height: 36px;
  padding-left: 32px;
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 14px;
  color: #7c85a6;
  line-height: 36px;
  position: relative;
  cursor: pointer;
}

.setting-dialog .dialog-tabs .tabs-title.active {
  background-color: #2e323d99;
  color: #cdd5de;
  font-weight: 500;
}

.setting-dialog .dialog-tabs .tabs-title.active:before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 36px;
  background: #1883FF;
}

.setting-dialog .dialog-tabs .tabs-title.active:after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 23px;
  height: 36px;
  opacity: .59;
  background: rgba(27, 93, 172, .85);
  filter: blur(16px);
}

.setting-dialog .close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.setting-dialog .close {
  background-image: url("@/assets/svg/close.svg");
}

.audio-setting-tab .item-setting-container .item-setting:not(:last-child) {
  margin-bottom: 20px;
}

.audio-setting-tab .item-setting-container {
  padding-bottom: 20px;
}

.audio-setting-tab .item-setting-container:not(:first-child) {
  padding-top: 20px;
}

.audio-setting-tab .title {
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
}

.audio-setting-tab .item-setting-container .flex {
  display: flex;
}

.audio-setting-tab .item-setting-container .detail-select {
  width: 309px;
  height: 32px;
}

.audio-setting-tab .item-setting-container .detail-select :deep(.el-input__inner) {
  width: 100%;
  flex-grow: 1;
  -webkit-appearance: none;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  padding: 0;
  outline: none;
  border: none;
  background: none;
  box-sizing: border-box;
}

.el-select-dropdown__item.selected {
  color: #006EFF;
  font-weight: 700;
}

.el-select-dropdown__item {
  font-size: 14px;
  padding: 0 32px 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #7C85A6;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;
}

.el-select__popper.el-popper[role=tooltip] {
  background: #1D2029;
  border: 1px solid #2E323D;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}

.audio-setting-tab .item-setting-container .button {
  width: 82px;
  height: 32px;
  background-image: linear-gradient(235deg, #1883FF 0%, #0062F5 100%);
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  font-weight: 400;
  font-size: 14px;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}

.audio-setting-tab .mic-bar-container {
  width: 100%;
  height: 4px;
  display: flex;
  justify-content: space-between;
}

.audio-setting-tab .mic-bar-container .mic-bar {
  width: 4px;
  height: 4px;
  background-color: #2e323d;
}

.audio-setting-tab .mic-bar-container .mic-bar.active {
  background-color: #43D92B;
}

.video-tab .title {
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
}

.video-tab {
  border-radius: 4px;
  font-size: 14px;
}

.video-tab .video-preview {
  width: 402px;
  height: 226px;
  background-color: #0d0f15;
}

.video-tab .item-setting-container {
  padding-bottom: 20px;
}

.video-tab .item-setting-container .item-setting:not(:last-child) {
  margin-bottom: 20px;
}

.setting-dialog .dialog-content {
  flex-grow: 1;
  padding: 32px;
}
</style>
