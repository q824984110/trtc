<template>
  <RouterView />
</template>


<script lang="ts" setup>
import { RouterView } from 'vue-router'
import TRTC from 'trtc-js-sdk';
import { ElMessage } from 'element-plus/es';
import { inject } from 'vue';

const $aegis: any = inject('$aegis');

// check current environment is supported TRTC or not
TRTC.checkSystemRequirements().then((checkResult) => {
  if (!checkResult.result) {
    console.log('checkResult', checkResult.result, 'checkDetail', checkResult.detail);
    ElMessage({ message: 'Your browser does not supported TRTC!', type: 'error' });
    window.location.href = 'https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html';
  }
});

$aegis.reportEvent({
  name: 'loaded',
  ext1: 'loaded-success',
  ext2: 'webrtcQuickDemoVue3',
});
</script>