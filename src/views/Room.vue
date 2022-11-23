<template>
  <div class="home-container">
    <div id="roomContainer"></div>
    <div element-loading-background="#000000" class="stream-container">
      <template v-if="cameraVisible">
        <div id="stream-preview" class="stream-preview"></div>
      </template>
      <template v-else>
        <div class="stream-info"><span class="info">摄像头已关闭</span></div>
      </template>
      <div class="control-region">
        <div class="icon-box false false">
          <span @click="handleMicrophone" class="icon-content">
            <template v-if="isMicrophone">
              <div class="audio-icon-container false">
                <div class="audio-level">
                  <div class="audio-level-item active"></div>
                  <div class="audio-level-item false"></div>
                  <div class="audio-level-item false"></div>
                  <div class="audio-level-item false"></div>
                  <div class="audio-level-item false"></div>
                </div>
                <div class="div large-icon mic-off audio-icon"></div>
              </div>
            </template>
            <template v-else>
              <div class="div large-icon mic-on audio-icon"></div>
            </template>
            <span class="title">麦克风</span>
          </span>
          <span class="icon-arrow" @click="audioDrawerOpen">
            <div icon-name="arrow-up" class="div small-icon arrow-up arrow">
            </div>
          </span>
        </div>

        <div class="icon-box false false icon"><span class="icon-content">
            <template v-if="!cameraVisible">
              <div @click="cameraOpen" class="div large-icon camera-off"></div>
              <span @click="cameraOpen" class="title">摄像头</span>
            </template>
            <template v-else>
              <div @click="cameraClose" class="div large-icon camera-on"></div>
              <span @click="cameraClose" class="title">摄像头</span>
            </template>
          </span>
          <span class="icon-arrow" @click="cameraDrawerOpen">
            <div icon-name="arrow-up" class="div small-icon arrow-up arrow">
            </div>
          </span>
        </div>
      </div>
    </div>

    <div class="drawer-container">
      <el-drawer :modal="false" size="480px" custom-class="room-sidebar" title="麦克风设置" v-model="drawer"
        :before-close="beforeClose">
        <div class="audio-setting-tab">
          <template v-if="audioVisible">
            <div class="item-setting-container">
              <div class="item-setting"><span class="title">麦克风</span>
                <div class="flex">
                  <el-select class="device-select" v-model='store.audioDeviceId' placeholder='Microphone'
                    @change='handleMicChange'>
                    <el-option v-for='item in store.microphoneList' :key='item.deviceId' :label='item.label'
                      :value='item.deviceId'>
                    </el-option>
                  </el-select>
                  <div class="button" @click="handleMicrophoneTest">
                    {{ isTestingMicrophone ? '停止测试' : '测试' }}
                  </div>
                </div>
              </div>
              <div class="item-setting"><span class="title">输出</span>
                <div class="mic-bar-container">
                  <div v-for="(item, index) in new Array(36).fill('')" :key="index"
                    :class="['mic-bar', `${isTestingMicrophone && volumeTestNum > index ? 'active' : ''}`]">
                  </div>
                </div>
              </div>
            </div>
            <div class="item-setting-container">
              <div class="item-setting"><span class="title">扬声器</span>
                <div class="flex">
                  <el-select class="device-select" v-model='store.speakerDeviceId' placeholder='speake'
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
          </template>
          <template v-if="videoVisible">
            <div class="item-setting-container">
              <div class="item-setting"><span class="title">摄像头</span>
                <div class="flex">
                  <el-select class="detail-select" v-model='store.videoDeviceId' placeholder='Camera'
                    @change='handleCameraChange'>
                    <el-option v-for='item in store.cameraList' :key='item.deviceId' :label='item.label'
                      :value='item.deviceId'>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="item-setting"><span class="title">视频画面</span>
                <div id="video-preview" class="video-preview">
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-drawer>
    </div>

    <div class="control-container">
      <div class="control-content"><img alt="" class="logo" src="@/assets/image/logo.png">
        <div class="control-region">
          <div class="button join-room-button create-room-button" type="primary">
            <input v-model="user" @change="changeUser" class="phone" placeholder="输入用户名" maxlength="13">
          </div>
          <div class="button join-room-button" type="primary">
            <input v-model="roomId" class="input" placeholder="输入房间号" maxlength="10">
            <span class="title" @click="handleCreateRoom">进入房间</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isDetect && showDialog" class="device-detector-backdrop">
    <div class="root" style="transform: scale(1);">
      <button @click="handleClose" type="button" class="button outlined close">跳过检测</button>
      <template v-if="step === 1">
        <div class="device-connect">
          <div class="testing-title">设备连接</div>
          <div class="testing-prepare-info">设备检测前请确认设备连接了摄像头、麦克风、扬声器和网络</div>
          <div class="device-display">
            <div class="connect-success">
              <span class="device">
                <svg t="1626142712993" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3296" width="28" height="28">
                  <path
                    d="M520.896 815.296c197.952 0 358.976-166.08 358.976-370.112s-161.088-370.112-358.976-370.112-358.848 166.016-358.848 370.112 160.96 370.112 358.848 370.112z m0-676.224c162.688 0 294.976 137.344 294.976 306.112 0 168.832-132.288 306.112-294.976 306.112-162.624 0-294.848-137.344-294.848-306.112-0.064-168.768 132.224-306.112 294.848-306.112z"
                    p-id="3297"></path>
                  <path
                    d="M824.256 746.112a32.128 32.128 0 0 0-29.888 56.64c21.888 11.584 27.264 20.736 27.52 22.528-1.92 20.864-106.688 69.824-300.992 69.824-191.488 0-299.072-49.536-300.864-69.824 0.128-1.664 5.056-10.432 26.176-21.888a32 32 0 0 0-30.464-56.256c-49.344 26.688-59.712 57.216-59.712 78.144 0 91.968 189.12 133.824 364.864 133.824 175.808 0 364.992-41.856 364.992-133.824 0-21.248-10.688-52.224-61.632-79.168zM520.96 618.816a173.632 173.632 0 1 0 0.128-347.264 173.632 173.632 0 0 0-0.128 347.264z m-59.968-315.648a70.976 70.976 0 1 1 0 141.952 70.976 70.976 0 0 1 0-141.952z"
                    p-id="3298"></path>
                </svg>
              </span>
            </div>
            <div class="connect-success">
              <span class="device">
                <svg t="1626144633308" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3443" width="28" height="28">
                  <path
                    d="M801.728 364.8a32 32 0 0 0-32 32v91.392c0 129.28-115.648 234.432-257.728 234.432S254.272 617.408 254.272 488.192V393.216a32 32 0 0 0-64 0v94.976c0 157.888 133.248 286.208 300.672 296.448v99.392H357.632c-16.128 0-29.184 14.336-29.184 32.064 0 17.664 13.056 31.936 29.184 31.936h319.04c16.064 0 29.184-14.272 29.184-31.936 0-17.728-13.12-32.064-29.184-32.064H554.944v-101.376c156.992-19.776 278.784-143.488 278.784-294.464V396.8c0-17.728-14.272-32-32-32z"
                    p-id="3444"></path>
                  <path
                    d="M517.12 678.656a199.104 199.104 0 0 0 198.912-198.848V268.736A199.168 199.168 0 0 0 517.12 69.888a199.04 199.04 0 0 0-198.784 198.848v211.072a199.04 199.04 0 0 0 198.784 198.848z m85.056-126.784a49.856 49.856 0 1 1 0-99.648 49.856 49.856 0 0 1 0 99.648zM382.336 268.736c0-74.368 60.48-134.848 134.784-134.848a135.04 135.04 0 0 1 134.912 134.848v28.48H382.336v-28.48z"
                    p-id="3445"></path>
                </svg>
              </span>
            </div>
            <div class="connect-success">
              <span class="device">
                <svg t="1626144666665" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3590" width="28" height="28">
                  <path
                    d="M784 371.2c-16-25.6-35.2-44.8-44.8-54.4-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 6.4 6.4 9.6 9.6 9.6 9.6 19.2 22.4 25.6 35.2 57.6 86.4 57.6 179.2-38.4 278.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C851.2 598.4 851.2 476.8 784 371.2z"
                    p-id="3591"></path>
                  <path
                    d="M896 246.4c-16-25.6-35.2-48-54.4-70.4-9.6-12.8-19.2-19.2-25.6-25.6-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 12.8 9.6 22.4 22.4 16 19.2 32 38.4 48 64 105.6 160 105.6 336-70.4 518.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C1014.4 630.4 1014.4 425.6 896 246.4z"
                    p-id="3592"></path>
                  <path
                    d="M483.2 86.4l-217.6 185.6-108.8 0c-57.6 0-108.8 48-108.8 108.8l0 272c0 60.8 48 108.8 108.8 108.8l96 0 230.4 182.4c54.4 41.6 105.6 16 105.6-51.2l0-755.2C588.8 67.2 534.4 41.6 483.2 86.4zM534.4 889.6c0 22.4-3.2 22.4-19.2 9.6l-236.8-185.6c-3.2-3.2-9.6-6.4-16-6.4l-105.6 0c-28.8 0-54.4-25.6-54.4-54.4l0-272c0-28.8 25.6-54.4 54.4-54.4l118.4 0c6.4 0 12.8-3.2 16-6.4l224-192c16-12.8 16-12.8 16 6.4L531.2 889.6z"
                    p-id="3593"></path>
                </svg>
              </span>
            </div>
            <div class="connect-success">
              <span class="device">
                <svg t="1626144678606" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3738" width="28" height="28">
                  <path
                    d="M955.392 514.56c0-242.688-196.608-439.296-439.296-439.296C273.408 75.264 76.8 271.872 76.8 514.56c0 242.688 196.608 439.296 439.296 439.296 116.224 0 221.696-45.056 300.032-118.784 5.12-1.536 9.728-4.096 13.312-8.704 3.072-3.072 5.12-6.656 6.656-10.752C909.824 736.768 955.392 631.296 955.392 514.56zM481.792 893.952c-0.512-1.024-1.536-1.536-2.56-2.56-47.104-40.96-85.504-89.6-114.176-143.36 38.4-15.872 79.36-25.6 121.856-28.672l0 174.592C485.376 893.952 483.328 893.952 481.792 893.952zM136.192 542.72l113.152 0c3.072 61.44 16.384 121.344 38.912 177.664-21.504 12.288-41.472 26.112-60.928 41.984C175.616 702.464 142.336 626.176 136.192 542.72zM230.4 262.656c18.944 15.36 38.912 28.672 59.392 40.96-23.552 56.832-37.376 118.272-40.448 180.736L136.704 484.352C143.36 399.872 177.664 323.072 230.4 262.656zM549.376 135.168c1.024 1.024 1.536 2.048 3.072 3.072 45.568 39.424 83.456 86.528 111.616 138.24-37.888 15.36-77.824 24.576-118.784 27.648l0-168.96C546.816 135.168 548.352 135.168 549.376 135.168zM895.488 484.352l-113.152 0c-3.584-62.464-17.408-123.392-40.96-180.736 20.992-11.776 40.96-25.6 59.904-40.96C854.528 323.072 888.832 399.872 895.488 484.352zM486.912 484.352 308.224 484.352c3.072-53.76 15.36-105.984 34.816-155.136 45.568 18.944 94.208 30.208 143.872 33.28L486.912 484.352zM486.912 542.72l0 117.76c-50.688 3.072-99.84 14.848-145.92 33.792-18.432-48.128-29.696-99.328-32.768-151.552L486.912 542.72zM545.28 542.72l178.176 0c-3.072 52.736-14.336 103.936-32.768 152.064-46.08-19.456-95.232-30.72-145.408-34.304L545.28 542.72zM545.28 484.352 545.28 362.496c49.664-3.072 98.304-14.336 143.36-32.768 19.456 49.152 31.232 101.376 34.816 154.624L545.28 484.352zM716.8 250.368c-17.408-31.744-37.376-61.952-60.928-90.112 37.888 14.848 72.704 35.84 103.424 61.44C745.472 232.448 731.136 242.176 716.8 250.368zM486.912 134.656l0 168.96c-40.96-3.072-81.408-12.288-118.784-27.648 28.16-51.712 65.536-98.304 111.104-137.728 1.024-1.024 2.56-2.56 3.584-3.584C483.84 135.168 485.376 135.168 486.912 134.656zM315.392 250.368c-14.848-8.704-28.672-18.432-42.496-28.672 30.72-25.6 65.536-46.08 102.912-60.928C352.768 188.416 332.288 218.624 315.392 250.368zM312.832 774.144c17.408 33.28 38.4 65.024 62.464 94.208-38.912-15.36-74.752-37.376-106.496-64C283.136 793.088 297.984 783.36 312.832 774.144zM545.28 894.464l0-174.592c41.984 3.072 82.944 12.8 121.344 28.672-28.672 53.76-67.072 102.4-114.176 143.36-1.024 1.024-1.536 1.536-2.56 2.56C548.352 893.952 546.816 893.952 545.28 894.464zM718.848 774.656c14.848 9.216 29.696 18.944 43.52 30.208-31.232 26.624-67.072 48.128-105.984 63.488C680.448 839.68 701.44 807.936 718.848 774.656zM743.936 720.896c22.528-56.32 35.84-116.736 38.912-178.176L896 542.72c-6.144 83.968-39.936 160.256-91.648 220.672C784.896 747.52 764.928 733.184 743.936 720.896z"
                    p-id="3739"></path>
                </svg>
              </span>
            </div>
          </div>
          <div v-if="!noticeState" class="text red-text">
            <span>{{ connectInfo }}</span>
            <div class="error-connect"><span class="error-icon"><svg t="1626151898274" class="icon"
                  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3223" width="28"
                  height="28">
                  <path
                    d="M1024 518.314667C1024 794.794667 794.737778 1024 505.685333 1024 229.205333 1024 0 794.737778 0 518.314667 0 229.262222 229.262222 0 505.685333 0 794.737778 0 1024 229.262222 1024 518.314667zM512 256a48.128 48.128 0 0 0-48.753778 51.370667L477.866667 614.4h68.266666l14.620445-307.029333A48.355556 48.355556 0 0 0 512 256z m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z"
                    fill="#FF0000" p-id="3224"></path>
                </svg></span></div>
          </div>
          <div v-else class="text green-text">
            <span>{{ connectInfo }}</span>
          </div>
          <div class="button-container">
            <button @click="handleNext('default', false)" type="button" class="button contained undefined">开始检测</button>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="showSteps">
          <div class="step-container">
            <div :class="{ 'step': true, 'active': step >= 2 }"><span class="step-icon"><svg t="1626142712993"
                  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3296"
                  width="28" height="28">
                  <path
                    d="M520.896 815.296c197.952 0 358.976-166.08 358.976-370.112s-161.088-370.112-358.976-370.112-358.848 166.016-358.848 370.112 160.96 370.112 358.848 370.112z m0-676.224c162.688 0 294.976 137.344 294.976 306.112 0 168.832-132.288 306.112-294.976 306.112-162.624 0-294.848-137.344-294.848-306.112-0.064-168.768 132.224-306.112 294.848-306.112z"
                    p-id="3297"></path>
                  <path
                    d="M824.256 746.112a32.128 32.128 0 0 0-29.888 56.64c21.888 11.584 27.264 20.736 27.52 22.528-1.92 20.864-106.688 69.824-300.992 69.824-191.488 0-299.072-49.536-300.864-69.824 0.128-1.664 5.056-10.432 26.176-21.888a32 32 0 0 0-30.464-56.256c-49.344 26.688-59.712 57.216-59.712 78.144 0 91.968 189.12 133.824 364.864 133.824 175.808 0 364.992-41.856 364.992-133.824 0-21.248-10.688-52.224-61.632-79.168zM520.96 618.816a173.632 173.632 0 1 0 0.128-347.264 173.632 173.632 0 0 0-0.128 347.264z m-59.968-315.648a70.976 70.976 0 1 1 0 141.952 70.976 70.976 0 0 1 0-141.952z"
                    p-id="3298"></path>
                </svg></span><span class="step-label">CAMERA</span></div>
            <div :class="{ 'step': true, 'active': step >= 3 }"><span class="step-icon"><svg t="1626144633308"
                  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3443"
                  width="28" height="28">
                  <path
                    d="M801.728 364.8a32 32 0 0 0-32 32v91.392c0 129.28-115.648 234.432-257.728 234.432S254.272 617.408 254.272 488.192V393.216a32 32 0 0 0-64 0v94.976c0 157.888 133.248 286.208 300.672 296.448v99.392H357.632c-16.128 0-29.184 14.336-29.184 32.064 0 17.664 13.056 31.936 29.184 31.936h319.04c16.064 0 29.184-14.272 29.184-31.936 0-17.728-13.12-32.064-29.184-32.064H554.944v-101.376c156.992-19.776 278.784-143.488 278.784-294.464V396.8c0-17.728-14.272-32-32-32z"
                    p-id="3444"></path>
                  <path
                    d="M517.12 678.656a199.104 199.104 0 0 0 198.912-198.848V268.736A199.168 199.168 0 0 0 517.12 69.888a199.04 199.04 0 0 0-198.784 198.848v211.072a199.04 199.04 0 0 0 198.784 198.848z m85.056-126.784a49.856 49.856 0 1 1 0-99.648 49.856 49.856 0 0 1 0 99.648zM382.336 268.736c0-74.368 60.48-134.848 134.784-134.848a135.04 135.04 0 0 1 134.912 134.848v28.48H382.336v-28.48z"
                    p-id="3445"></path>
                </svg></span><span class="step-label">MICROPHONE</span></div>
            <div :class="{ 'step': true, 'active': step >= 4 }"><span class="step-icon"><svg t="1626144666665"
                  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3590"
                  width="28" height="28">
                  <path
                    d="M784 371.2c-16-25.6-35.2-44.8-44.8-54.4-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 6.4 6.4 9.6 9.6 9.6 9.6 19.2 22.4 25.6 35.2 57.6 86.4 57.6 179.2-38.4 278.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C851.2 598.4 851.2 476.8 784 371.2z"
                    p-id="3591"></path>
                  <path
                    d="M896 246.4c-16-25.6-35.2-48-54.4-70.4-9.6-12.8-19.2-19.2-25.6-25.6-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 12.8 9.6 22.4 22.4 16 19.2 32 38.4 48 64 105.6 160 105.6 336-70.4 518.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C1014.4 630.4 1014.4 425.6 896 246.4z"
                    p-id="3592"></path>
                  <path
                    d="M483.2 86.4l-217.6 185.6-108.8 0c-57.6 0-108.8 48-108.8 108.8l0 272c0 60.8 48 108.8 108.8 108.8l96 0 230.4 182.4c54.4 41.6 105.6 16 105.6-51.2l0-755.2C588.8 67.2 534.4 41.6 483.2 86.4zM534.4 889.6c0 22.4-3.2 22.4-19.2 9.6l-236.8-185.6c-3.2-3.2-9.6-6.4-16-6.4l-105.6 0c-28.8 0-54.4-25.6-54.4-54.4l0-272c0-28.8 25.6-54.4 54.4-54.4l118.4 0c6.4 0 12.8-3.2 16-6.4l224-192c16-12.8 16-12.8 16 6.4L531.2 889.6z"
                    p-id="3593"></path>
                </svg></span><span class="step-label">SPEAKER</span></div>
            <div :class="{ 'step': true, 'active': step >= 5 }"><span class="step-icon"><svg t="1626144678606"
                  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3738"
                  width="28" height="28">
                  <path
                    d="M955.392 514.56c0-242.688-196.608-439.296-439.296-439.296C273.408 75.264 76.8 271.872 76.8 514.56c0 242.688 196.608 439.296 439.296 439.296 116.224 0 221.696-45.056 300.032-118.784 5.12-1.536 9.728-4.096 13.312-8.704 3.072-3.072 5.12-6.656 6.656-10.752C909.824 736.768 955.392 631.296 955.392 514.56zM481.792 893.952c-0.512-1.024-1.536-1.536-2.56-2.56-47.104-40.96-85.504-89.6-114.176-143.36 38.4-15.872 79.36-25.6 121.856-28.672l0 174.592C485.376 893.952 483.328 893.952 481.792 893.952zM136.192 542.72l113.152 0c3.072 61.44 16.384 121.344 38.912 177.664-21.504 12.288-41.472 26.112-60.928 41.984C175.616 702.464 142.336 626.176 136.192 542.72zM230.4 262.656c18.944 15.36 38.912 28.672 59.392 40.96-23.552 56.832-37.376 118.272-40.448 180.736L136.704 484.352C143.36 399.872 177.664 323.072 230.4 262.656zM549.376 135.168c1.024 1.024 1.536 2.048 3.072 3.072 45.568 39.424 83.456 86.528 111.616 138.24-37.888 15.36-77.824 24.576-118.784 27.648l0-168.96C546.816 135.168 548.352 135.168 549.376 135.168zM895.488 484.352l-113.152 0c-3.584-62.464-17.408-123.392-40.96-180.736 20.992-11.776 40.96-25.6 59.904-40.96C854.528 323.072 888.832 399.872 895.488 484.352zM486.912 484.352 308.224 484.352c3.072-53.76 15.36-105.984 34.816-155.136 45.568 18.944 94.208 30.208 143.872 33.28L486.912 484.352zM486.912 542.72l0 117.76c-50.688 3.072-99.84 14.848-145.92 33.792-18.432-48.128-29.696-99.328-32.768-151.552L486.912 542.72zM545.28 542.72l178.176 0c-3.072 52.736-14.336 103.936-32.768 152.064-46.08-19.456-95.232-30.72-145.408-34.304L545.28 542.72zM545.28 484.352 545.28 362.496c49.664-3.072 98.304-14.336 143.36-32.768 19.456 49.152 31.232 101.376 34.816 154.624L545.28 484.352zM716.8 250.368c-17.408-31.744-37.376-61.952-60.928-90.112 37.888 14.848 72.704 35.84 103.424 61.44C745.472 232.448 731.136 242.176 716.8 250.368zM486.912 134.656l0 168.96c-40.96-3.072-81.408-12.288-118.784-27.648 28.16-51.712 65.536-98.304 111.104-137.728 1.024-1.024 2.56-2.56 3.584-3.584C483.84 135.168 485.376 135.168 486.912 134.656zM315.392 250.368c-14.848-8.704-28.672-18.432-42.496-28.672 30.72-25.6 65.536-46.08 102.912-60.928C352.768 188.416 332.288 218.624 315.392 250.368zM312.832 774.144c17.408 33.28 38.4 65.024 62.464 94.208-38.912-15.36-74.752-37.376-106.496-64C283.136 793.088 297.984 783.36 312.832 774.144zM545.28 894.464l0-174.592c41.984 3.072 82.944 12.8 121.344 28.672-28.672 53.76-67.072 102.4-114.176 143.36-1.024 1.024-1.536 1.536-2.56 2.56C548.352 893.952 546.816 893.952 545.28 894.464zM718.848 774.656c14.848 9.216 29.696 18.944 43.52 30.208-31.232 26.624-67.072 48.128-105.984 63.488C680.448 839.68 701.44 807.936 718.848 774.656zM743.936 720.896c22.528-56.32 35.84-116.736 38.912-178.176L896 542.72c-6.144 83.968-39.936 160.256-91.648 220.672C784.896 747.52 764.928 733.184 743.936 720.896z"
                    p-id="3739"></path>
                </svg></span><span class="step-label">NETWORK</span></div>
          </div>

          <div v-if="step === 2" class="testing-container">
            <div class="testing-body">
              <div class="device-list">
                <span class="device-list-title">摄像头选择</span>
                <div>
                  <el-select class="device-select" v-model='store.videoDeviceId' placeholder='Camera'
                    @change='handleCameraChange'>
                    <el-option v-for='item in store.cameraList' :key='item.deviceId' :label='item.label'
                      :value='item.deviceId'>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div id="camera-video" class="camera-video">
                <div id="player_74c1439f-5beb-4a6b-bad2-291bd0602f66"
                  style="width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;">
                  <div id="video-test-preview" class="video-test-preview">
                  </div>
                </div>
              </div>
              <div class="testing-info-container">
                <div class="testing-info">是否可以清楚的看到自己？</div>
                <div class="button-list">
                  <button @click="handleNext('camera', false)" type="button"
                    class="button outlined undefined">看不到</button>
                  <button @click="handleNext('camera', true)" type="button"
                    class="button contained undefined">看的到</button>
                </div>
              </div>
            </div>


          </div>

          <div v-if="step === 3" class="testing-container">
            <div class="testing-body">
              <div class="device-list"><span class="device-list-title">麦克风选择</span>
                <div>
                  <el-select class="device-select" v-model='store.audioDeviceId' placeholder='Microphone'
                    @change='handleMicChange'>
                    <el-option v-for='item in store.microphoneList' :key='item.deviceId' :label='item.label'
                      :value='item.deviceId'>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="mic-testing-container">
                <div class="mic-testing-info">对着麦克风说 哈喽 试试～</div>
                <div class="mic-bar-container">
                  <div v-for="(item, index) in new Array(28).fill('')" :key="index"
                    :class="['mic-bar', `${isTestingMicrophone && volumeTestNum > index ? 'active' : ''}`]">
                  </div>
                </div>
                <div id="audio-container">
                  <div id="player_3eff534c-d628-4942-a534-1a47bc0e3272"
                    style="width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;">
                    <audio id="audio_3eff534c-d628-4942-a534-1a47bc0e3272" autoplay playsinline></audio>
                  </div>
                </div>
              </div>
              <div class="testing-info-container">
                <div class="testing-info">是否可以看到音量图标跳动？</div>
                <div class="button-list">
                  <button @click="handleNext('mic', false)" type="button" class="button outlined undefined">看不到</button>
                  <button @click="handleNext('mic', true)" type="button" class="button contained undefined">看的到</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="step === 4" class="testing-container">
            <div class="testing-body">
              <div class="device-list">
                <span class="device-list-title">扬声器选择</span>
                <div>
                  <el-select class="device-select" v-model='store.speakerDeviceId' placeholder='speake'
                    @change='handleSpeakerChange'>
                    <el-option v-for='item in store.speakerList' :key='item.deviceId' :label='item.label'
                      :value='item.deviceId'>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="audio-player-container">
                <div class="audio-player-info">请调高设备音量，点击播放下面的音频试试～</div><audio id="audio-player"
                  src="https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/45f1edea3701925920950247965/v.f1010.mp3"
                  controls></audio>
              </div>
              <div class="testing-info-container">
                <div class="testing-info">是否可以听到声音？</div>
                <div class="button-list">
                  <button @click="handleNext('audio', false)" type="button"
                    class="button outlined undefined">听不到</button>
                  <button @click="handleNext('audio', true)" type="button"
                    class="button contained undefined">听的到</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="step === 5" class="testing-container">
            <div class="testing-body">
              <div class="testing-list">
                <div class="testing-item-container">
                  <div>操作系统</div>
                  <div class="">{{ device.system.OS }}</div>
                </div>
                <div class="testing-item-container">
                  <div>浏览器</div>
                  <div class="">{{ device.system.browser.name + ' ' + device.system.browser.version }}</div>
                </div>
                <div class="testing-item-container">
                  <div>是否支持TRTC</div>
                  <div class="">{{ device.APISupported.isWebRTCSupported ? '支持' : '不支持' }}</div>
                </div>
                <div class="testing-item-container">
                  <div>是否支持屏幕分享</div>
                  <div class="">{{ device.APISupported.isScreenCaptureAPISupported ? '支持' : '不支持' }}</div>
                </div>

              </div><button @click="handleNext('default', false)" type="button"
                class="button contained undefined">查看报告</button>
            </div>
          </div>
        </template>


        <div v-if="showReport" class="device-testing-report">
          <div class="testing-title">检测报告</div>
          <div class="device-report-list">
            <div class="device-report">
              <div class="device-info"><span class="report-icon"><svg t="1626142712993" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3296" width="28"
                    height="28">
                    <path
                      d="M520.896 815.296c197.952 0 358.976-166.08 358.976-370.112s-161.088-370.112-358.976-370.112-358.848 166.016-358.848 370.112 160.96 370.112 358.848 370.112z m0-676.224c162.688 0 294.976 137.344 294.976 306.112 0 168.832-132.288 306.112-294.976 306.112-162.624 0-294.848-137.344-294.848-306.112-0.064-168.768 132.224-306.112 294.848-306.112z"
                      p-id="3297"></path>
                    <path
                      d="M824.256 746.112a32.128 32.128 0 0 0-29.888 56.64c21.888 11.584 27.264 20.736 27.52 22.528-1.92 20.864-106.688 69.824-300.992 69.824-191.488 0-299.072-49.536-300.864-69.824 0.128-1.664 5.056-10.432 26.176-21.888a32 32 0 0 0-30.464-56.256c-49.344 26.688-59.712 57.216-59.712 78.144 0 91.968 189.12 133.824 364.864 133.824 175.808 0 364.992-41.856 364.992-133.824 0-21.248-10.688-52.224-61.632-79.168zM520.96 618.816a173.632 173.632 0 1 0 0.128-347.264 173.632 173.632 0 0 0-0.128 347.264z m-59.968-315.648a70.976 70.976 0 1 1 0 141.952 70.976 70.976 0 0 1 0-141.952z"
                      p-id="3298"></path>
                  </svg></span>
                <div class="device-name">{{ store.cameraList[0].label }}</div>
              </div>
              <div v-if="reportState.camera" class="green">正常</div>
              <div v-else class="red">异常</div>
            </div>
            <div class="device-report">
              <div class="device-info"><span class="report-icon"><svg t="1626144633308" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3443" width="28"
                    height="28">
                    <path
                      d="M801.728 364.8a32 32 0 0 0-32 32v91.392c0 129.28-115.648 234.432-257.728 234.432S254.272 617.408 254.272 488.192V393.216a32 32 0 0 0-64 0v94.976c0 157.888 133.248 286.208 300.672 296.448v99.392H357.632c-16.128 0-29.184 14.336-29.184 32.064 0 17.664 13.056 31.936 29.184 31.936h319.04c16.064 0 29.184-14.272 29.184-31.936 0-17.728-13.12-32.064-29.184-32.064H554.944v-101.376c156.992-19.776 278.784-143.488 278.784-294.464V396.8c0-17.728-14.272-32-32-32z"
                      p-id="3444"></path>
                    <path
                      d="M517.12 678.656a199.104 199.104 0 0 0 198.912-198.848V268.736A199.168 199.168 0 0 0 517.12 69.888a199.04 199.04 0 0 0-198.784 198.848v211.072a199.04 199.04 0 0 0 198.784 198.848z m85.056-126.784a49.856 49.856 0 1 1 0-99.648 49.856 49.856 0 0 1 0 99.648zM382.336 268.736c0-74.368 60.48-134.848 134.784-134.848a135.04 135.04 0 0 1 134.912 134.848v28.48H382.336v-28.48z"
                      p-id="3445"></path>
                  </svg></span>
                <div class="device-name">{{ store.microphoneList[0].label }}</div>
              </div>
              <div v-if="reportState.mic" class="green">正常</div>
              <div v-else class="red">异常</div>
            </div>
            <div class="device-report">
              <div class="device-info"><span class="report-icon"><svg t="1626144666665" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3590" width="28"
                    height="28">
                    <path
                      d="M784 371.2c-16-25.6-35.2-44.8-44.8-54.4-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 6.4 6.4 9.6 9.6 9.6 9.6 19.2 22.4 25.6 35.2 57.6 86.4 57.6 179.2-38.4 278.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C851.2 598.4 851.2 476.8 784 371.2z"
                      p-id="3591"></path>
                    <path
                      d="M896 246.4c-16-25.6-35.2-48-54.4-70.4-9.6-12.8-19.2-19.2-25.6-25.6-9.6-9.6-28.8-9.6-38.4 3.2-9.6 9.6-9.6 28.8 3.2 38.4 3.2 3.2 12.8 9.6 22.4 22.4 16 19.2 32 38.4 48 64 105.6 160 105.6 336-70.4 518.4-9.6 9.6-9.6 28.8 0 38.4 9.6 9.6 28.8 9.6 38.4 0C1014.4 630.4 1014.4 425.6 896 246.4z"
                      p-id="3592"></path>
                    <path
                      d="M483.2 86.4l-217.6 185.6-108.8 0c-57.6 0-108.8 48-108.8 108.8l0 272c0 60.8 48 108.8 108.8 108.8l96 0 230.4 182.4c54.4 41.6 105.6 16 105.6-51.2l0-755.2C588.8 67.2 534.4 41.6 483.2 86.4zM534.4 889.6c0 22.4-3.2 22.4-19.2 9.6l-236.8-185.6c-3.2-3.2-9.6-6.4-16-6.4l-105.6 0c-28.8 0-54.4-25.6-54.4-54.4l0-272c0-28.8 25.6-54.4 54.4-54.4l118.4 0c6.4 0 12.8-3.2 16-6.4l224-192c16-12.8 16-12.8 16 6.4L531.2 889.6z"
                      p-id="3593"></path>
                  </svg></span>
                <div class="device-name">{{ store.speakerList[0].label }}</div>
              </div>
              <div v-if="reportState.audio" class="green">正常</div>
              <div v-else class="red">异常</div>
            </div>

          </div>
          <div class="device-report-footer">
            <button @click="handleReset" type="button" class="button outlined undefined">重新检测</button>
            <button @click="handleComplate" type="button" class="button contained undefined">完成检测</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 初始化监测模块
import { ref, onMounted } from 'vue';
import TRTC from 'trtc-js-sdk';
import type { LocalStream } from 'trtc-js-sdk';
import appStore from '@/store/index';
import type { DeviceItem } from '@/types/type';
import router from '@/router';
import { isOnline } from '@/utils/utils'
import RTCDetect from 'rtc-detect';

const store = appStore();
let audioStream: LocalStream;
let testStream: LocalStream;
let userStream: LocalStream;
let microphoneStream: LocalStream;
let timer: any;
const user = ref<string>();
const roomId = ref<string>();
const drawer = ref(false); // 弹窗显示
const isMicrophone = ref(false); // 麦克风状态
const isTestingMicrophone = ref(false); // 麦克风测试状态
const volumeNum = ref(0); // 音量大小
const volumeTestNum = ref(0); // 音量大小
const cameraVisible = ref(false); // 摄像头状态
const cameraTestVisible = ref(false); // 摄像头测试状态
const audioVisible = ref(false); // 音频弹窗
const videoVisible = ref(false); // 摄像头弹窗
const step = ref(1);
const showReport = ref(false);
const showSteps = ref(false);
const showDialog = ref(false);
const isDetect = ref(false);
const device = ref<any>();
const deviceState = ref<any>();
const noticeState = ref(false);
const connectInfo = ref<string>();
const reportState = ref<any>({});
onMounted(() => {

  cameraOpen();
  if (!localStorage.getItem('trtc-detect')) {
    isDetect.value = true
    deviceTest();
  }


});

const handleNext = async (name: string = 'default', success: boolean = false) => {
  let state: any = {
    ...reportState.value
  }
  state[name] = success
  console.log('reportState')
  console.log(state)
  reportState.value = state

  if (step.value === 1) {
    showSteps.value = true
    showReport.value = false
    cameraFirstOpen()
  }

  if (step.value === 2) {
    handleMicrophoneTest()
  }

  if (step.value === 5) {
    showSteps.value = false
    showReport.value = true

  }

  step.value += 1

}

const handleClose = () => {
  showDialog.value = false
}

const handleComplate = () => {
  showDialog.value = false
  localStorage.setItem('trtc-detect', 'true')
}

const getDeviceConnectInfo = () => {
  if (deviceState.value.hasCameraConnect && deviceState.value.hasMicrophoneConnect && deviceState.value.hasNetworkConnect) {
    connectInfo.value = '设备连接成功，请开始设备检测';
    noticeState.value = true;
    return
  }

  // 第二步：浏览器未拿到摄像头/麦克风权限的提示
  if (!(deviceState.value.hasCameraConnect && deviceState.value.hasMicrophoneConnect)) {
    connectInfo.value = deviceState.value.hasNetworkConnect
      ? '请允许浏览器及网页访问摄像头/麦克风设备'
      : '请允许浏览器及网页访问摄像头/麦克风设备，并检查网络连接'
    noticeState.value = false;
    return
  }
  // 第三步：浏览器检测未连接网络的提示
  if (!deviceState.value.hasNetworkConnect) {
    connectInfo.value = '网络连接失败，请检查网络连接'
    noticeState.value = false;
    return
  }

};

const deviceTest = async () => {
  showDialog.value = true
  const detect = new RTCDetect();
  const result = await detect.getReportAsync();
  console.log('result is: ');
  console.log(result);
  device.value = result
  let deviceStateObj = {
    hasCameraDevice: store.cameraList.length > 0,
    hasMicrophoneDevice: store.microphoneList.length > 0,
    hasSpeakerDevice: store.speakerList.length > 0,
    hasNetworkConnect: await isOnline(),
    hasCameraConnect: false,
    hasMicrophoneConnect: false,
  };
  deviceState.value = deviceStateObj

  getDeviceConnectInfo()

  if (store.cameraList.length > 0) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        deviceStateObj = {
          ...deviceStateObj,
          hasCameraConnect: true,
        };
        deviceState.value = deviceStateObj
        getDeviceConnectInfo()
        stream.getTracks()[0].stop();
      })
  }

  if (store.microphoneList.length > 0) {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: store.microphoneList.length > 0 })
      .then((stream) => {
        deviceStateObj = {
          ...deviceStateObj,
          hasMicrophoneConnect: store.microphoneList.length > 0,
        };
        deviceState.value = deviceStateObj
        getDeviceConnectInfo()
        stream.getTracks()[0].stop();
      })
  }

}

const handleReset = () => {
  step.value = 1
  showReport.value = false
  showSteps.value = false
}

function changeUser(e: any) {
  console.log(e.target.value);
  user.value = e.target.value;
  // store.$patch({
  //   userId: value,
  // });
}

// 切换驱动设备
const updateDevice = async () => {
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
});

navigator.mediaDevices.ondevicechange = updateDevice;


async function switchDevice(id: string, name: string) {

  switch (name) {
    case 'camera':
      await testStream.switchDevice('video', id);
      break;
    case 'mic':
      await testStream.switchDevice('audio', id);
      break;
  }

}

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

// 摄像头弹窗打开
function cameraDrawerOpen() {
  drawer.value = true;
  videoVisible.value = true;
  cameraTestOpen();
}

// 麦克风弹窗打开
function audioDrawerOpen() {
  drawer.value = true;
  audioVisible.value = true;
}

// 弹窗隐藏
function beforeClose() {
  drawer.value = false;
  audioVisible.value = false;
  videoVisible.value = false;
  if (cameraTestVisible.value) {
    cameraTestClose();
  }
}

// 点击摄像头开始
async function cameraOpen() {
  userStream = TRTC.createStream({
    video: true,
    audio: false,
    cameraId: store.videoDeviceId,
  });

  cameraVisible.value = true;
  await userStream.initialize();
  userStream.play('stream-preview');
}

// 点击摄像头关闭
function cameraClose() {
  cameraVisible.value = false;
  userStream.close();
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

// 摄像头检测测试开始
async function cameraFirstOpen() {
  testStream = TRTC.createStream({
    video: true,
    audio: false,
    cameraId: store.videoDeviceId,
  });

  await testStream.initialize();
  testStream.play('video-test-preview');
}


// 点击摄像头测试关闭
function cameraTestClose() {
  cameraTestVisible.value = false;
  testStream.close();
}

const isTestingSpeaker = ref(false);
const audioPlayer = document.createElement('audio');
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

// 点击创建房间
async function handleCreateRoom() {
  console.log('user.value', user.value)
  store.$patch({
    userId: user.value,
    roomId: roomId.value,
    sdkAppId: '1400732658',
    secretKey: '608413a3324e1d748b58c1d00749825a762742ee68635179c6e1a9cbc3c2cd14',
  });

  router.push({ path: 'page', query: { roomId: roomId.value } });
}

// 点击麦克风测试
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
      volumeTestNum.value = audioStream.getAudioLevel() * 100;
    }, 500);
  } else {
    isTestingMicrophone.value = false;
    clearInterval(timer);
    volumeTestNum.value = 0;
    audioStream.close();
  }
}

// 点击麦克风
async function handleMicrophone() {
  if (!isMicrophone.value) {
    isMicrophone.value = true;
    microphoneStream = TRTC.createStream({
      video: false,
      audio: true,
      microphoneId: store.audioDeviceId,
    });
    await microphoneStream.initialize();
    microphoneStream.play('roomContainer');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timer = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      volumeNum.value = microphoneStream.getAudioLevel() * 100;
    }, 500);
  } else {
    isMicrophone.value = false;
    clearInterval(timer);
    volumeNum.value = 0;
    microphoneStream.close();
  }
}

</script>

<style scoped>
.large-icon {
  width: 32px;
  height: 32px;
}

.small-icon {
  width: 12px;
  height: 12px;
}

.div {
  overflow: hidden;
  display: inline-block;
  background-size: contain;
}

.home-container {
  width: 100%;
  height: 100%;
  background-color: #010101;
  color: #b3b8c8;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: PingFangSC-Medium;
}

#roomContainer {
  display: none;
}

.home-container .header {
  width: 100%;
  position: absolute;
  top: 0;
  padding: 22px 24px;
  display: flex;
  align-items: center;
}

.home-container .header .user-info-container {
  position: relative;
}

.home-container .header .user-info-container .user-info-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.home-container .header .user-info-container .user-info-content .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.home-container .header .user-info-container .user-info-content .name {
  max-width: 100px;
  margin-left: 20px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-container .header .user-info-container .user-info-content .down-icon {
  margin-left: 4px;
  width: 20px;
  height: 20px;
  overflow: hidden;
  display: inline-block;
  background-size: contain;
}

.home-container .stream-container {
  width: 740px;
  height: 476px;
  background-color: #12141a;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  border: 2px solid #1B1E26;
}

.home-container .stream-container .stream-preview {
  width: 100%;
  height: 100%;
}

.home-container .stream-container .stream-preview .stream-player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  overflow: hidden;
}

.home-container .stream-container .stream-info {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container .stream-container .stream-info .info {
  width: 132px;
  height: 34px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 22px;
  color: #676c80;
  line-height: 34px;
}

.home-container .stream-container .control-region {
  height: 74px;
  background: rgba(13, 16, 21, 0.6);
  border-radius: 43px;
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translate(-50%);
  padding: 0 50px;
  display: flex;
}

.home-container .stream-container .control-region .icon-box {
  width: 78px;
  position: relative;
  display: flex;
  cursor: pointer;
  padding: 10px 0;
}

.home-container .stream-container .control-region .icon-box .icon-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.home-container .stream-container .control-region .icon-box .icon-content .audio-icon-container {
  position: relative;
  width: 32px;
  height: 32px;
}

.home-container .stream-container .control-region .icon-box .icon-content .audio-icon-container .audio-level {
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

.home-container .stream-container .control-region .icon-box .icon-content .audio-icon-container .audio-level .audio-level-item {
  width: 100%;
  height: 2px;
  border-radius: 50%;
}

.home-container .stream-container .control-region .icon-box .icon-content .audio-icon-container .audio-icon {
  position: absolute;
}

.home-container .stream-container .control-region .icon-box .icon-content .mic-off {
  background: url("@/assets/svg/mic.svg");
}

.home-container .stream-container .control-region .icon-box .icon-content .mic-on {
  background: url("@/assets/svg/mic-on.svg");
}

.home-container .stream-container .control-region .icon-box .icon-content .camera-on {
  background: url("@/assets/svg/camera-on.svg");
}

.home-container .stream-container .control-region .icon-box .icon-content .camera-off {
  background: url("@/assets/svg/camera.svg");
}

.home-container .stream-container .control-region .icon-box .icon-content .title {
  font-size: 12px;
}

.home-container .stream-container .control-region .icon-box .icon-arrow {
  position: absolute;
  right: 0;
  top: 8px;
  width: 12px;
  height: 64px;
}

.home-container .stream-container .control-region .icon-box .icon-arrow .arrow {
  position: absolute;
  top: 20px;
  left: 0;
}

.home-container .stream-container .control-region .icon-box .icon-arrow .arrow-up {
  background: url("@/assets/svg/arrow-up.svg");
}

.home-container .stream-container .control-region .icon-box .icon-arrow:hover {
  background: rgba(46, 50, 61, 0.7);
}

.home-container .stream-container .control-region .icon:not(:first-child) {
  margin-left: 30px;
}

.home-container .drawer-container :deep(.el-drawer) {
  background-color: #1d2029;
  pointer-events: auto;
}

.home-container .drawer-container :deep(.el-drawer__body) {
  padding: 32px;
}

.home-container .drawer-container .audio-setting-tab {
  border-radius: 4px;
  font-size: 14px;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container {
  padding-bottom: 20px;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .item-setting:not(:last-child) {
  margin-bottom: 20px;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .title {
  display: inline-block;
  margin-bottom: 10px;
  width: 100%;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .mic-bar-container {
  width: 100%;
  height: 4px;
  display: flex;
  justify-content: space-between;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .mic-bar-container .mic-bar {
  width: 4px;
  height: 4px;
  background-color: #2e323d;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .mic-bar-container .mic-bar.active {
  background-color: #43D92B;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .flex {
  display: flex;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .flex .detail-select {
  width: 309px;
  height: 32px;
  font-size: 14px;
}

.home-container .drawer-container .audio-setting-tab .item-setting-container .flex .detail-select :deep(.el-input__inner) {
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

.home-container .drawer-container .audio-setting-tab .item-setting-container .flex .button {
  width: 82px;
  height: 32px;
  background-image: linear-gradient(235deg, #1883FF 0%, #0062F5 100%);
  border-radius: 2px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}

.home-container .control-container {
  width: 430px;
  height: 476px;
  border-radius: 20px;
  margin-left: 40px;
  position: relative;
  background-image: linear-gradient(230deg, rgba(61, 119, 255, 0.53), rgba(61, 143, 255, 0) 50%);
}

.home-container .control-container .title {
  font-size: 22px;
  color: #fff;
  line-height: 34px;
  margin-left: 9px;
}

.home-container .control-container .control-content {
  height: 100%;
  padding: 0 40px;
  border-radius: 20px;
  background: rgba(27, 30, 38, 0.9);
}

.home-container .control-container .control-content .logo {
  position: absolute;
  top: 78px;
  left: 50%;
  width: 318px;
  height: 42px;
  transform: translate(-50%);
}

.home-container .control-container .control-content .control-region {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
}

.home-container .control-container .control-content .control-region .create-room-button {
  position: absolute;
  top: 214px;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room .add-icon {
  background: url("@/assets/svg/add-icon.svg");
}

.home-container .control-container .control-content .control-region .create-room-button .connect-region {
  width: 100%;
  height: 6px;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode {
  width: 100%;
  position: absolute;
  top: calc(100% + 4px);
  z-index: 10;
  background-color: #1d2437;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 1px 10px #091d3b;
  border-radius: 8px;
  padding: 4px 0;
  display: none;
}

.home-container .control-container .control-content .control-region .create-room-button:hover .create-room-mode {
  display: block;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode .create-room-option {
  height: 48px;
  padding-left: 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode .create-room-option .icon {
  background-color: #cfd4e6;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode .create-room-option .free-speech-icon {
  background: url("@/assets/svg/free-speech-icon.svg");
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode .create-room-option .title {
  font-weight: 400;
  font-size: 14px;
  color: #cfd4e6;
}

.home-container .control-container .control-content .control-region .create-room-button .create-room-mode .create-room-option .apply-speech-icon {
  background: url("@/assets/svg/apply-speech-icon.svg");
}

.home-container .control-container .control-content .control-region .create-room-option:hover {
  background-color: #323b5499;
}

.home-container .control-container .control-content .control-region .button {
  width: 360px;
  height: 88px;
  display: flex;
  background-image: linear-gradient(-45deg, #006EFF 0%, #0C59F2 100%);
  box-shadow: 0 2px 4px #0003;
  border-radius: 8px;
  cursor: pointer;
}

.home-container .control-container .control-content .control-region .join-room-button {
  position: absolute;
  bottom: 50px;
  padding: 2px;
}

.home-container .control-container .control-content .control-region .join-room-button .phone {
  width: 100%;
  background: rgba(27, 30, 38, 0.9);
  border-color: transparent;
  outline: none;
  border-radius: 8px;
  font-weight: 400;
  font-size: 22px;
  color: #676c80;
  line-height: 34px;
  padding: 0 20px;
}

.home-container .control-container .control-content .control-region .join-room-button .input {
  width: 172px;
  border: 0;
  height: 100%;
  background: rgba(27, 30, 38, 0.9);
  border-color: transparent;
  outline: none;
  border-radius: 8px;
  font-weight: 400;
  font-size: 22px;
  color: #676c80;
  line-height: 34px;
  padding: 0 20px;
}

.home-container .control-container .control-content .control-region .join-room-button .title {
  margin-left: 28px;
  cursor: pointer;
  align-self: center;
}

@media screen and (max-width: 520px) {
  .root {
    min-width: 520px;
  }
}

.device-detector-backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1300;
  opacity: 1;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.device-detector-backdrop .root {
  position: relative;
  width: 600px;
  height: 480px;
  font-size: 16px;
  box-shadow: 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  border-radius: 4px;
}

.device-detector-backdrop .root .stepper {
  border-radius: 5px 5px 0 0;
  font-size: 36px;
}

.device-detector-backdrop .root .close {
  color: #eeeeee;
  border-radius: 20px;
  border-color: #eeeeee;
  position: absolute;
  cursor: pointer;
  top: -50px;
  right: 2px;
}

.device-detector-backdrop .root .device-connect {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.device-detector-backdrop .root .device-connect .testing-title {
  display: flex;
  font-size: 32px;
  justify-content: center;
  margin-top: 55px;
  color: #201e1ee5;
}

.device-detector-backdrop .root .device-connect .testing-prepare-info {
  max-width: 500px;
  text-align: center;
  display: flex;
  font-size: 16px;
  justify-content: center;
  margin-top: 30px;
  color: #585656e5;
}

.device-detector-backdrop .root .device-connect .device-display {
  width: 420px;
  margin: 40px auto 20px;
  display: flex;
  justify-content: space-around;
  position: relative;
}

.device-detector-backdrop .root .device-connect .device-display .connect-success {
  position: relative;
}

.device-detector-backdrop .root .device-connect .device-display .connect-fail {
  position: relative;
}

.device-detector-backdrop .root .device-connect .device-display .connect-fail::before {
  content: "";
  width: 28px;
  height: 28px;
  position: absolute;
  bottom: -34px;
  left: 50%;
  transform: translateX(-50%);
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3ElEQVRYR+2Wr08cQRTHP+8ESZOq GlKBaKhpUwWmCnG7d4giwDS5NGlVMWDAtIZfrQEDpjVF0ZC0wH/QWxr+gNrKJigSBA4J98hN7pbl 9mZnZklz5tasmPfm+5nve/t2hAE/MmB9hgBDB5wOaJVx+c2/Ms2qEc+BCznm3JZvBdBpHnPNmUlU VuWYzyEQGrGC8KmdI4m92e0AbXrhbyoqfJQmWz4QWuMDymYa2+KpzcXCEmjMOrCWEV2WhJ0iCI1Z ArbTGId77h7ohRAWpcnXfhBaYwHlS4hrTgDTAnkn5iVhNwuhMe+BbyFumf7wqakF4p0kfO+svQX2 Mie3utSr5w3QF6JCw2zY4kdm45w7RYcMArA4kd0/dcXX2WAAK0SFhvzip69wN64cQJ0XtDgEnmXq /lqaHP13AK0yQcWIj+fEhGCIIAc05iUY8bGO+EbnfTusAiG8AbTOVMf20a64JGZS5udEAIQXgEbE CAfAo17xbhlyw8oTwgmgMa/AdPdDm/h9IIp/RjXmUCM+4hIvC2H/HdeZpMWfTKdvdGvu+tRy5bji iZxw2i+v6D7wBmHf9+S9m9+BKH0fiJilwgNp3pn1LgPSdY2YQbiUhBNbkrMJvdVKBg4Bhg4M3IEb uI2UIfOyj40AAAAASUVORK5CYII=") no-repeat;
  background-size: 100% 100%;
}

.device-detector-backdrop .root .device-connect .device-display .device {
  width: 46px;
  height: 46px;
  position: relative;
  justify-content: center;
  font-size: 38px;
}

.device-detector-backdrop .root .device-connect .device-display .device svg {
  width: 40px;
  height: 40px;
}

.device-detector-backdrop .root .device-connect .device-display .outer-progress {
  width: 360px;
  height: 4px;
  border-radius: 5px;
  position: absolute;
  top: 70px;
  background-color: #eeeeee;
  overflow: hidden;
}

.device-detector-backdrop .root .device-connect .device-display .outer-progress .inner-progress {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  border-radius: 5px;
  background-color: #bfbfbf;
  transform-origin: left;
  transition: transform 0.4s linear;
}

.device-detector-backdrop .root .device-connect .text {
  margin-top: 60px;
  font-size: 18px;
  max-width: 420px;
  text-align: center;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-detector-backdrop .root .device-connect .text.gray-text {
  color: #585656e5;
}

.device-detector-backdrop .root .device-connect .text.green-text {
  color: limegreen;
}

.device-detector-backdrop .root .device-connect .text.red-text {
  color: red;
}

.device-detector-backdrop .root .device-connect .text .error-connect {
  width: 20px;
  height: 20px;
  margin-left: 8px;
  position: relative;
}

.device-detector-backdrop .root .device-connect .text .error-connect .error-icon svg {
  width: 20px;
  height: 20px;
}

.device-detector-backdrop .root .device-connect .text .error-connect .connect-attention-info {
  padding: 8px 12px;
  min-width: 160px;
  min-height: 50px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  color: #fff;
  position: absolute;
  right: 0;
  bottom: 100%;
  transform: translate(20px, -10px);
  display: block;
  white-space: nowrap;
  font-size: 12px;
  text-align: left;
}

.device-detector-backdrop .root .device-connect .text .error-connect .connect-attention-info::after {
  content: "";
  width: 0;
  height: 0;
  border: 10px transparent solid;
  border-top-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 100%;
  top: 100%;
  transform: translateX(-40px);
}

.device-detector-backdrop .root .device-connect .button-container {
  margin-top: 40px;
  width: 40%;
  display: flex;
  justify-content: space-around;
}

.device-detector-backdrop .root .device-select {
  width: 260px;
  padding: 6px 14px 6px 12px;
  position: relative;
  font-size: 16px;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.device-detector-backdrop .root .device-select:focus {
  outline: none;
}

.device-detector-backdrop .root .step-container {
  display: flex;
  padding: 24px;
}

.device-detector-backdrop .root .step-container .step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  fill: rgba(0, 0, 0, 0.54);
  color: rgba(0, 0, 0, 0.54);
}

.device-detector-backdrop .root .step-container .step:not(:first-child)::after {
  position: absolute;
  content: "";
  height: 1px;
  background-color: rgba(0, 0, 0, 0.16);
  right: 100%;
  top: 30%;
  right: calc(50% + 20px);
  left: calc(-50% + 20px);
  top: 16px;
}

.device-detector-backdrop .root .step-container .step.active {
  fill: #006EFF;
  color: #006EFF;
  cursor: pointer;
}

.device-detector-backdrop .root .step-container .step.active::after {
  background-color: #006EFF;
}

.device-detector-backdrop .root .step-container .step.error {
  fill: red;
  color: red;
  cursor: pointer;
}

.device-detector-backdrop .root .step-container .step.error::after {
  background-color: #006EFF;
}

.device-detector-backdrop .root .step-container .step .step-label {
  margin-top: 12px;
}

.device-detector-backdrop .root .testing-container {
  width: 100%;
  margin: 10px auto 30px;
}

.device-detector-backdrop .root .testing-container .testing-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.device-detector-backdrop .root .testing-container .testing-body.hide {
  display: none;
}

.device-detector-backdrop .root .testing-container .testing-body .device-list {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.device-detector-backdrop .root .testing-container .testing-body .device-list .device-list-title {
  margin-right: 10px;
}

.device-detector-backdrop .root .testing-container .testing-body .camera-video {
  width: 300px;
  height: 180px;
}

.device-detector-backdrop .root .testing-info-container {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  bottom: 30px;
}

.device-detector-backdrop .root .testing-info-container .testing-info {
  width: 100%;
  text-align: center;
  display: block;
}

.device-detector-backdrop .root .testing-info-container .button-list {
  margin-top: 20px;
  width: 300px;
  display: flex;
  justify-content: space-around;
}

.device-detector-backdrop .root .mic-testing-container {
  margin-top: 20px;
}

.device-detector-backdrop .root .mic-testing-container .mic-bar-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.device-detector-backdrop .root .mic-testing-container .mic-bar-container .mic-bar {
  width: 8px;
  height: 30px;
  border: 1px solid #cccccc;
  border-radius: 1px;
}

.device-detector-backdrop .root .mic-testing-container .mic-bar-container .mic-bar:not(:first-child) {
  margin-left: 3px;
}

.device-detector-backdrop .root .mic-testing-container .mic-bar-container .mic-bar.active {
  background: #006EFF;
}

.device-detector-backdrop .root .audio-player-container {
  width: 340px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px auto 0;
  text-align: center;
}

.device-detector-backdrop .root .audio-player-container .audio-player-info {
  margin: 0px auto 16px;
  color: #5f5f5f;
}

.device-detector-backdrop .root .testing-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.device-detector-backdrop .root .testing-list .testing-item-container {
  width: 70%;
  margin: 0 auto 10px;
  display: flex;
  justify-content: space-between;
}

@-webkit-keyframes loading-circle {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-circle {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.device-detector-backdrop .root .network-loading {
  display: flex;
}

.device-detector-backdrop .root .network-loading::before {
  content: "";
  width: 16px;
  height: 16px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAChElEQVRYR82WO2wTQRCGZ9YFLmmCQDRUFIgOCuhMg2QJ8OxKtpQuEggqQDz6hDIiSAg6QEo6pFi+WVsoLgkVDakgFFBAlYJ0IGRceAetdWddLF/uznacXHe38/j2n9mbRTjkB6eRn4jOWGt/jhMrMwARlRDxkogUEfETM7/zCY0xqyKyAAAe4G70PStMZgCt9WsAuBUG3mLmi5VK5ZxSajuWrM7MtazJvd1EAER0HBG/AcBcPxji8yAIHhDREiJeA4A/IvLBWruUBJUIoLX+AgC7IvLEWruZVAIimldKXXXOefstb6u1lljCbWY+nwsg3MFi6LTJzFeyyloul48Vi8V/MfvvzHw2F0Cstl6BZWvts6wA3o6I3iDizdDnBTPfzwUQGVer1bl6vb6bJ3nM92S321WtVmtHa/3QnxBE/BwEwY14vD094KXfr2HGASGiBURcjXxF5KW19l70PgDQWr8HgBIA5Kp5GpTWeh0AqjG7HWY+PUsAn9xD9J/wVA2O5YGXIGzKklJq3jn30Vq7ltgDaXJOsu7nhS+xUuqyc+6t/1/k+hNOktz7GmNYRCgWp8bM9X4JiGhZKXVCRDb8x0mTDfuPmBnepD83+gDRr3O4QaYJorX+AQC+DHuacSYKhCovIuJ1ALiAiGu9Xu9ps9n8mnkaTkuN4cvLzAGGN3J0AIjoESKuiMgda+2raUmeFmegwEED+KPom+7QSpA0aY9ODwxLY4w51el0/rbb7d9pdZxkfb9Lqb9YTvVuMAo0EcDfZAqFwq9Go7Exzg6NMStBEDxO883VA0R0e9QRTerwtOS5x3E4tPpjNAoeTrp151xt1DFLg8ilQFKwmSmQtptx1v8DVbAxMP//OLQAAAAASUVORK5CYII=") no-repeat;
  background-size: 100% 100%;
  -webkit-animation: loading-circle 2s linear infinite;
  animation: loading-circle 2s linear infinite;
}

.device-detector-backdrop .root .report-button {
  position: absolute;
  bottom: 60px;
  cursor: pointer;
}

.device-detector-backdrop .root .gray-button {
  position: absolute;
  bottom: 60px;
}

.device-detector-backdrop .root .device-testing-report {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}

.device-detector-backdrop .root .device-testing-report .testing-title {
  display: flex;
  font-size: 34px;
  justify-content: center;
  margin-top: 30px;
  color: #201e1ee5;
}

.device-detector-backdrop .root .device-testing-report .device-report-list {
  display: block;
  width: 100%;
  margin-top: 10px;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report {
  display: flex;
  width: 70%;
  margin: 20px auto 0;
  justify-content: space-between;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .device-info {
  display: flex;
  width: 80%;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .device-info .report-icon {
  margin-right: 20px;
  justify-content: center;
  font-size: 22px;
  line-height: 22px;
  color: #515151;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .device-info .report-icon svg {
  width: 24px;
  height: 24px;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .device-info .device-name {
  width: 280px;
  height: 24px;
  line-height: 24px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .green {
  color: green;
}

.device-detector-backdrop .root .device-testing-report .device-report-list .device-report .red {
  color: red;
}

.device-detector-backdrop .root .device-testing-report .device-report-footer {
  width: 50%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 36px;
}

.button {
  padding: 6px 16px;
  border-radius: 4px;
  border: 0;
  outline: none;
  background-color: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  font-weight: 500;
  line-height: 1.75;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.outlined {
  padding: 5px 15px;
  border: 1px solid #006eff;
  color: #006eff;
  cursor: pointer;
}

.contained {
  cursor: pointer;
  color: #ffffff;
  background-color: #006eff;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.disabled {
  box-shadow: none;
  color: rgba(0, 0, 0, 0.26);
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
