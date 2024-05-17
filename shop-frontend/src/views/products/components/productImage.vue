<template>
  <div class="goods-image">
    <!-- preview-->
    <div class="large" v-show="show" :style="[{ backgroundImage: `url(${images[currIndex]})` }, bgPositionStyle]"></div>
    <!-- Presented image -->
    <div class="middle">
      <img ref="target" :src="images[currIndex]" alt="" />
      <!-- Layer -->
      <div class="layer" v-show="show" :style="[positionStyle]"></div>
    </div>
    <!-- 缩略小图 -->
    <el-scrollbar>
      <ul class="small">
        <li v-for="(img, i) in images" :key="img" :class="{ active: i === currIndex }">
          <!-- 鼠标移入商品大图旁边的小图商品大图位置就会显示该图 -->
          <img @mouseenter="currIndex = i" :src="img" alt="" />
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { useMouseInElement } from '@vueuse/core';

  defineProps({
    images: {
      type: Array as () => string[],
      required: true,
      default: () => [],
    },
  });

  // show large img
  const show = ref(false);
  // the index to controll middel img
  const currIndex = ref(0);
  // get target dom
  const target: Ref<HTMLElement | null> = ref(null);
  // 记录遮罩半透明图在商品大图中的坐标位置
  const position = reactive({
    top: 0,
    left: 0,
  });
  const positionStyle = computed(() => {
    return reactive({
      top: `${position.top}px`,
      left: `${position.left}px`,
    });
  });

  // 记录遮罩层做覆盖的区域在预览时的预览大图的坐标位置
  const bgPosition = reactive({
    backgroundPositionX: 0,
    backgroundPositionY: 0,
  });
  const bgPositionStyle = computed(() => {
    return reactive({
      backgroundPositionX: `${bgPosition.backgroundPositionX}px`,
      backgroundPositionY: `${bgPosition.backgroundPositionY}px`,
    });
    // return ref(`${bgPosition.backgroundPositionX}px ${bgPosition.backgroundPositionY}px`);
  });
  // watch mouse position
  const { elementX, elementY, isOutside } = useMouseInElement(target);
  watch([elementX, elementY, isOutside], () => {
    // isisOutside.value 为 true 的时候代表鼠标未进入目标元素，为 false 时代表鼠标进入目标元素
    // 为 true 是不记录坐标以免损耗性能
    if (isOutside.value) {
      // 鼠标未进入目标元素不显示遮罩层和预览大图
      show.value = false;
      return;
    }
    // 鼠标进入目标元素显示遮罩层和预览大图
    show.value = true;
    // left 的边界值（左、右）
    if (elementX.value < 100) {
      position.left = 0;
    } else if (elementX.value > 300) {
      position.left = 200;
    } else {
      position.left = elementX.value - 100;
    }
    // top 的边界值（上、下）
    if (elementY.value < 100) {
      position.top = 0;
    } else if (elementY.value > 300) {
      position.top = 200;
    } else {
      position.top = elementY.value - 100;
    }
    // 遮罩层所覆盖的商品图片部分在预览大图中的坐标，加单位
    bgPosition.backgroundPositionY = -position.top * 2;
    bgPosition.backgroundPositionX = -position.left * 2;
  });
</script>
<style scoped lang="less">
  .goods-image {
    width: 480px;
    height: 400px;
    position: relative;
    display: flex;
    z-index: 500;

    .large {
      position: absolute;
      top: 0;
      left: 412px;
      width: 400px;
      height: 400px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      background-repeat: no-repeat;
      background-size: 800px 800px;
      background-color: #f8f8f8;
    }
    .middle {
      width: 400px;
      height: 400px;
      position: relative;
      cursor: zoom-in;
      img {
        width: 100%;
        height: 100%;
      }
      .layer {
        width: 200px;
        height: 200px;
        background: rgba(0, 0, 0, 0.2);
        left: 0;
        top: 0;
        position: absolute;
      }
    }
    .small {
      width: 80px;
      li {
        width: 68px;
        height: 68px;
        margin-left: 12px;
        margin-bottom: 15px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        &:hover,
        &.active {
          border: 2px solid #dad2f8;
        }
      }
    }
  }
</style>
