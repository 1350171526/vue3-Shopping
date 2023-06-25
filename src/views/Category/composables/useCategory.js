// 封装分类业务相关代码
import { getCategoryAPI } from '@/apis/category';
import { onMounted, ref } from 'vue';
// 解决路由缓存问题
import { onBeforeRouteUpdate } from 'vue-router';
import { useRoute } from 'vue-router';


// 获取数据
export function useCategory(){
const categoryData = ref({})
const route = useRoute()
const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id)
    categoryData.value = res.result
}
onMounted(() => getCategory())

// 路由参数变化的时候 可以把分类数据接口重新发送
onBeforeRouteUpdate((to) => {
    getCategory(to.params.id)
})

return {
    categoryData
}
}