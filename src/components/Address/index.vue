<script setup>
import { addAddressAPI,delAddressAPI, getAddressAPI } from '@/apis/checkout'
import { onMounted, ref, computed } from 'vue';
import { regionData,codeToText  } from 'element-china-area-data'

// 获取地址
const addressInfo = ref({})
const curAddress = ref({})
const getAddress = async () =>{
  const res = await getAddressAPI()
  
  addressInfo.value = res.result
  // console.log(addressInfo.value);
  // 适配默认地址 从地址列表筛选出来 isdefault ===0 的项
  const item = addressInfo.value.find(item => item.isDefault === 0)
  curAddress.value = item
  // console.log(res.result[0]);
  
}
onMounted(() => {
  getAddress()
})

// 控制弹框打开 
const showDialog = ref(false)
const formRef = ref(null)
const addFlag = ref(false)
const title4 = ref()
// const reviseFlag = ref(false)

// 切换地址
const activeAddress = ref({})
const switchAddress = (item) => {
  activeAddress.value = item
}
const comfirm = () =>{
  curAddress.value =activeAddress.value
  showDialog.value =false
  activeAddress.value = {}
}

// 添加地址
const addButton = () =>{
  addFlag.value = true
  title4.value = '添加收货地址'
}
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
  // console.log(form.value.fullLocation);
  
  if (!formRef.value) return
  // console.log(typeof(checkInfo.value.userAddresses[6].fullLocation));
  await formRef.value.validate(async (valid) =>{
    // valid 表示所有的表单全部为验证通过 才为true
    
    if (valid) {
      const temp = computed(() => {
      // console.log(form.value.fullLocation);

        // Array.from()方法可以将proxy对象转化为数组！！！
        const temp1 = Array.from(form.value.fullLocation)
        const temp2 = temp1.map((item) => codeToText[item]).join(" ")
        return temp2
      })
      const provinceCode = form.value.fullLocation[0] * 10000
      const cityCode = form.value.fullLocation[1] * 100
      const res = await addAddressAPI({
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
      curAddress.value = addressInfo.value.find(item => item.id = res.result.id)
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
// 取消添加或修改地址
const cancel = (formRef) => {
  form.value = {}
  addFlag.value = false
  if (!formRef) return
  formRef.resetFields()
}

// 修改地址(没有使用修改地址接口  使用了删除和添加地址接口)
const reviseAddress = (item) => {
  // reviseFlag.value = true
  addFlag.value = true
  title4.value = '修改收货地址'
  const provinceCode = String(item.provinceCode/10000) 
  const cityCode = String(item.cityCode/100)
  const countyCode = item.countyCode
  form.value.receiver = item.receiver
  form.value.contact = item.contact
  form.value.address = item.address
  form.value.postalCode = item.postalCode
  form.value.addressTags = item.addressTags
  form.value.fullLocation = [provinceCode,cityCode,countyCode]
  // console.log(form.value.fullLocation);
  // console.log(curAddress.value.id);
}
const confirmReAddress = async (id) => {
  // await getAddress()
  // console.log(id);
  await delAdress(id)
  await addAddress()
}


// 关闭弹框时执行函数
const handleClose = () =>{
  form.value = {}
}

defineExpose({
  curAddress
})
</script>

<template>
<!-- <div class="xtx-pay-checkout-page">
  <div class="container">
    <div class="wrapper"> -->
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
              <el-button size="large" @click="addButton">添加地址</el-button>
            </div>
          </div>
        </div>
    <!-- </div>
  </div>
</div> -->

<!--切换地址-->
<el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
  <div class="addressWrapper">
    <div class="text item" :class="{ active:activeAddress.id === item.id }" @click="switchAddress(item)" v-for="item in addressInfo"  :key="item.id" >
      <ul>
      <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
      <li><span>联系方式：</span>{{ item.contact }}</li>
      <li><span>收货地址：</span>{{ item.fullLocation }} {{ item.address }}</li>
      
      </ul>
      <a @click="reviseAddress(item)">修改地址</a>
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

<!-- 添加/修改地址 -->
<!-- :before-close绑定 可以再用户点击关闭按钮或者对话框遮罩区域"前"被调用 -->
<!-- :onClose绑定 可以再用户点击关闭按钮或者对话框遮罩区域"时"被调用 -->
<!-- :close-on-click-modal 点击遮罩层是否关闭对话框 -->
<!-- 官方文档推荐使用:header="title" 不推荐使用:title="title" -->
<el-dialog v-model="addFlag" :title="title4" width="30%" :onClose="handleClose" :close-on-click-modal="false" center>
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
      <el-button @click="cancel(formRef)">取消</el-button>
      <el-button type="primary" @click="title4=='添加收货地址'? addAddress() : confirmReAddress(activeAddress.id)">确定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<style lang="scss" scoped>

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
.addressWrapper {
  max-height: 600px;
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
  a{
    right: 40px;
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
