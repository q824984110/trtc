import { defineStore } from 'pinia';
import { genTestUserSig } from '@/utils/generateTestUserSig';

const appStore = defineStore('app', {
  state: () => ({
    sdkAppId: '1400732658',
    userId: '',
    user: '',
    roomId: '500',
    secretKey: '608413a3324e1d748b58c1d00749825a762742ee68635179c6e1a9cbc3c2cd14',
    userSig: '',
    audioDeviceId: '',
    videoDeviceId: '',
    speakerDeviceId: '',
    cameraList: [],
    microphoneList: [],
    speakerList: [],
    logs: [],
    isJoined: false,
    isPublished: false,
    isShared: false,
    remoteStreams: [],
    invitedRemoteStreams: [],
  }),
  getters: {},
  actions: {
    getInitParamsStates() {
      return !!(this.sdkAppId && this.secretKey && this.roomId && this.userId);
    },
    getUserSig() {
      return this.userSig || genTestUserSig({
        sdkAppId: parseInt(this.sdkAppId, 10),
        userId: this.userId,
        secretKey: this.secretKey,
      }).userSig;
    },
    createShareLink() {
      const userId = `Guest_${Math.floor(Math.random() * 1000000)}`;
      const { userSig } = genTestUserSig({
        sdkAppId: parseInt(this.sdkAppId, 10),
        userId,
        secretKey: this.secretKey,
      });
      const { origin } = window.location;
      const { pathname } = window.location;
      return `${origin}${pathname}#/invite?userSig=${userSig}&&SDKAppId=${this.sdkAppId}&&userId=${userId}&&roomId=${this.roomId}`;
    },
    addSuccessLog(str: string) {
      this.logs.push({
        type: 'success',
        content: str,
      });
    },
    addFailedLog(str: string) {
      this.logs.push({
        type: 'failed',
        content: str,
      });
    },
  },
});

export default appStore;
