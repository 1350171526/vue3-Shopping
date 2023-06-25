<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

// 触发获取导航列表的action
import { useCategoryStore } from '@/stores/category'
import { onMounted } from 'vue'

const categoryStore = useCategoryStore()
onMounted(() => categoryStore.getCategory())
</script>
<template>
    <LayoutFixed />
    <LayoutNav />
    <LayoutHeader />
    <!-- 解决路由缓存（组件复用）问题： 添加key破坏复用机制 强制销毁重建  简单粗暴 -->
    <!-- <RouterView :key="$route.fullPath" /> -->
    <RouterView />
    <LayoutFooter />
</template>
