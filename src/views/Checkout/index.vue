<script setup>
import { getCheckoutInfoAPI,createOrderAPI,addAddressAPI,delAddressAPI,reviseAddressAPI, getAddressAPI } from '@/apis/checkout'
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useCartStore }from '@/stores/cartStore'
// 导入element 地区组件
import { regionData,codeToText  } from 'element-china-area-data'
// import { formatPostcssSourceMap } from 'vite';



const cartStore = useCartStore()
const router = useRouter()
const checkInfo = ref({})  // 订单对象
const curAddress = ref({})
// const orderId = ref()
const addressInfo = ref({})
// const userId = ref({})
const getAddress = async () =>{
  const res = await getAddressAPI()
  addressInfo.value = res.result
  // 适配默认地址 从地址列表筛选出来 isdefault ===0 的项
  const item = addressInfo.value.find(item => item.isDefault === 0)
  curAddress.value = item
}
onMounted(() => getAddress())
const getCheckoutInfo = async () =>{
  const res = await getCheckoutInfoAPI()
  checkInfo.value = res.result
  
  // const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0)
  // curAddress.value = item
  // userId.value = res.result.userAddresses
}
onMounted(()=> getCheckoutInfo())

// 控制弹框打开 
const showDialog = ref(false)

// 切换地址
const activeAddress = ref({})
const switchAddress = async (item) => {
  // await getCheckoutInfo()
  // await getAddress()
  activeAddress.value = item

}
const comfirm = () =>{
  curAddress.value =activeAddress.value
  showDialog.value =false
  activeAddress.value = {}
}

// 创建订单
const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    goods: checkInfo.value.goods.map(item => {
      return {
        skuId: item.skuId,
        count: item.count
      }
    }),
    addressId: curAddress.value.id
  })
  const orderId = res.result.id
  router.push({
    path: '/pay',
    // 添加参数
    query: {
      id: orderId
    }
  })
  // 更新购物车
  cartStore.updateNewList()
}

// 添加地址
// const newAddress = ref({})
const formRef = ref(null)
const addFlag = ref(false)
// import { reactive } from 'vue'


const form = ref({
  receiver: '',
  contact: '',
  address: '',
  postalCode: '',
  addressTags: '无',
  fullLocation: [],

})

// 自定义规则
const rules = {
  // trigger: 'blur' 表示失去焦点的时候进行验证  trigger: 'change' 表示当值发生变化时进行验证
  receiver: [
    {required: true, message: '收货人不能为空', trigger: 'blur'}
  ],
  contact: [
    {required: true, message: '联系方式不能为空', trigger: 'blur'},
    // 首尾用'//'包裹 ^表示开头 &表示结尾 第一个数字是1 第二个数字是3-9 /d表示任意数 {9}表示/d要出现9次
    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
  ],
  postalCode: [
    {required: true, message: '邮政编码不能为空', trigger: 'blur'},
    {pattern: /^\d{6}$/, message: '请输入正确的邮政编码', trigger: 'blur'}
  ],
  address: [
    {required: true, message: '详细地址不能为空', trigger: 'blur'}
  ],
  fullLocation: [
  {required: true, message: '收货地址不能为空', trigger: 'change'}
  ]
}

const addAddress = async () => {
  // console.log(cityList);
  const temp = computed(() => {
    // Array.from()方法可以将proxy对象转化为数组！！！
    const temp1 = Array.from(form.value.fullLocation)
    const temp2 = temp1.map((item) => codeToText[item]).join(" ")
    return temp2
  })
  const provinceCode = form.value.fullLocation[0] * 10000
  const cityCode = form.value.fullLocation[1] * 100

  // console.log(typeof(checkInfo.value.userAddresses[6].fullLocation));
  formRef.value.validate(async (valid) =>{
    // valid 表示所有的表单全部为验证通过 才为true
    
    if (valid) {
      await addAddressAPI({
      receiver: form.value.receiver,
      contact: form.value.contact,
      provinceCode: provinceCode,
      cityCode: cityCode,
      countyCode: form.value.fullLocation[2],
      address: form.value.address,
      postalCode: form.value.postalCode,
      addressTags: form.value.addressTags,
      isDefault: 1,
      fullLocation: temp.value
    })
    await getAddress()
    // orderId = res.result.id
    curAddress.value = addressInfo.value[0]
    curAddress.value.fullLocation = temp.value
    // console.log(orderId);
    addFlag.value = false
    form.value = {}
    }
  })
  
  
}
// 删除地址
const delAdress = async (id) => {
  await delAddressAPI(id)
  await getAddress()
}
// 取消添加地址
const cancel = () => {
  form.value = {}
  addFlag.value = false
}


// 修改地址


</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showDialog = true">切换地址</el-button>
              <el-button size="large" @click="addFlag = true">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.price }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
          <!-- 提交订单 -->
          <div class="submit">
            <el-button @click="createOrder" type="primary" size="large">提交订单</el-button>
          </div>
      </div>
    </div>
  </div>
  <!--切换地址-->
  <el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
  <div class="addressWrapper">
    <div class="text item" :class="{ active:activeAddress.id === item.id }" @click="switchAddress(item)" v-for="item in addressInfo"  :key="item.id">
      <ul>
      <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
      <li><span>联系方式：</span>{{ item.contact }}</li>
      <li><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</li>
      
      </ul>
      <a>修改地址</a>
      <i class="iconfont icon-close-new" @click="delAdress(item.id)"></i>
    </div>
    
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="showDialog=fales">取消</el-button>
      <el-button type="primary" @click="comfirm">确定</el-button>
    </span>
  </template>
</el-dialog>
  <!-- 添加地址 -->
  <el-dialog v-model="addFlag" title="添加收货地址" width="30%" center>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item prop="receiver" label="收货人：" >
        <el-input v-model="form.receiver" placeholder="请填写收货人" />
      </el-form-item>
      <el-form-item prop="contact" label="联系方式：">
        <el-input v-model="form.contact" placeholder="请填写联系方式" />
      </el-form-item>
      <el-form-item prop="postalCode" label="邮政编码：">
        <el-input v-model="form.postalCode" placeholder="请填写邮政编码" />
      </el-form-item>
      <!-- <el-select prop="province" v-model="form.province" placeholder="请选择省" @change="changeProvince()">
            <el-option v-for="item in regionData" :label="item.label" :value="item.value" />
      </el-select>
      <el-select prop="city" v-model="form.city" placeholder="请选择市" :disabled="!form.province " @change="changeCity()">
            <el-option v-for="item in cityList" :label="item.label" :value="item.value" />
      </el-select>
      <el-select prop="area" v-model="form.area" placeholder="请选择区/县" :disabled="!form.province || !form.city " >
            <el-option v-for="item in areaList" :label="item.label" :value="item.value" />
      </el-select> -->
      
      <el-form-item prop="fullLocation" label="收货地址：" >
        <el-cascader size="large" :options="regionData" v-model="form.fullLocation" placeholder="请选择收货地址">
      </el-cascader>
      </el-form-item>
      <el-form-item prop="address" label="详细地址：" >
        <el-input v-model="form.address" placeholder="请填写详细地址" />
      </el-form-item>
    </el-form>
    
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="addAddress">应用</el-button>
    </span>
  </template>
</el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    ul {
      flex: 1;
      padding: 20px;
      
      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    
    } 


    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;
  cursor: auto;
  position: relative;

  i,
  a{
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    // cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
      position: relative;
    }
  }
}

</style>