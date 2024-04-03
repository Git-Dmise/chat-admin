<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" icon="el-icon-refresh-right" @click="refresh">
        重置
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_type === 1 ? '普通用户' : '合作商户' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返佣模式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cashback_type === 1 ? '首次付费返佣' : '多次付费返佣' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返佣比例" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cashback_prop }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="注册人数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.register_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付费人数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pay_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计充值" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.pay_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="续费率" align="center">
        <template slot-scope="{row}">
          <span>{{ row.renew_prop }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="退款率" align="center">
        <template slot-scope="{row}">
          <span>{{ row.refund_prop }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.refund_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计返佣金额" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.accumulate_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已提现金额" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.used_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余可提现" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.usable_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户id">
          <span>{{ temp.user_id }}</span>
        </el-form-item>
        <el-form-item label="用户账号">
          <span>{{ temp.account }}</span>
        </el-form-item>
        <el-form-item label="账号类型" prop="user_type">
          <el-select v-model="temp.user_type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in userType" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="返佣模式" prop="cashback_type">
          <span v-if="temp.user_type===1">首次付费返佣</span>
          <el-select v-else v-model="temp.cashback_type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in cashbackType" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.user_type===2 && temp.cashback_type===2" label="附加条件1" prop="times_limit">
          <el-select v-model="temp.times_limit" class="filter-item" placeholder="Please select">
            <el-option v-for="item in timesLimit" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="temp.user_type===2 && temp.cashback_type===2 ? '附加条件2':'附加条件'" prop="time_limit">
          <el-select v-model="temp.time_limit" class="filter-item" placeholder="Please select">
            <el-option v-for="item in timeLimit" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="返佣比例" prop="cashback_prop">
          <el-input v-model.number="temp.cashback_prop" class="cashback_prop" />%
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { incomeList, fetchPv, createArticle, updateIncome } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const userType = [
  { key: 1, display_name: '普通用户' },
  { key: 2, display_name: '合作商户' }
]

const cashbackType = [
  { key: 1, display_name: '首次付费返佣' },
  { key: 2, display_name: '多次付费返佣' }
]

const timesLimit = [
  { key: 0, display_name: '无' },
  { key: 1, display_name: '前2次付费返佣' },
  { key: 2, display_name: '前3次付费返佣' },
  { key: 3, display_name: '前4次付费返佣' },
  { key: 4, display_name: '前5次付费返佣' }
]

const timeLimit = [
  { key: 0, display_name: '无' },
  { key: 1, display_name: '注册后1周内付费计算返佣' },
  { key: 2, display_name: '注册后1月内付费计算返佣' },
  { key: 3, display_name: '注册后3月内付费计算返佣' },
  { key: 4, display_name: '注册后1年内付费计算返佣' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = userType.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 10,
        username: ''
      },
      importanceOptions: [1, 2, 3],
      userType,
      cashbackType,
      timesLimit,
      timeLimit,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        user_id: undefined,
        account: '',
        user_type: 1,
        cashback_type: 1,
        cashback_prop: 10,
        times_limit: 0,
        time_limit: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {
    'temp.cashback_prop'(newVal) {
      if (newVal > 100) {
        this.temp.cashback_prop = 100
      } else if (newVal < 0) {
        this.temp.cashback_prop = 0
      }
    },
    'temp.user_type'(newVal) {
      if (newVal === 1) {
        this.temp.cashback_type = 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      incomeList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refresh() {
      this.listQuery.username = ''
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    resetTemp() {
      this.temp = {
        user_id: undefined,
        account: '',
        user_type: 1,
        cashback_type: 1,
        cashback_prop: 10
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.user_type === 1 || this.temp.cashback_type === 1) {
            this.temp.times_limit = 0
          }
          const tempData = Object.assign({}, this.temp)
          updateIncome(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
  .cashback_prop{
    width: 200px;
    padding: 2mm;
  }
</style>
