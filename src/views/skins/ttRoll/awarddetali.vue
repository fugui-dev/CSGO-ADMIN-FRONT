<template>
  <div class="home">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="itemName" label="装备名称"></el-table-column>
      <el-table-column align="center" prop="itemName" label="装备图片">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="40" :height="40" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="usePrice" label="价格"></el-table-column>
      <el-table-column align="center" prop="userId" label="获奖用户ID">
        <template slot-scope="scope">{{scope.row.userId || '无'}}</template>
      </el-table-column>
      <el-table-column align="center" prop="nickName" label="获奖用户昵称">
        <template slot-scope="scope">{{scope.row.nickName || '无'}}</template>
      </el-table-column>
      <el-table-column align="center" prop="designatedBy" label="指定人">
        <template slot-scope="scope">{{scope.row.designatedBy || "无" }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleAppoint(scope.row)">指定获奖者</el-button>
          <el-button type="text" @click="cancelNamedWinnerMethod(scope.row)">取消奖品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />-->
    <el-dialog title="指定获奖者" :visible.sync="dialogFormVisible">
      <el-form :model="formAdd" label-width="120px">
        <el-form-item label="ROLL房内用户">
          <el-popover placement="bottom-start" width="460" trigger="hover" ref="morePop">
            <el-input slot="reference" v-model="form.nickName" placeholder="用户 " readonly></el-input>
            <el-form>
              <el-row>
                <el-col :span="18">
                  <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入用户名称"
                    @input="serchornaments"
                  ></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button @click="serchornaments" style="margin-left: 35px;">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-form v-loading="loadings" v-if="userList !== null">
                  <div class="magicbox" @scroll="scrollEventFn" v-if="userList.length > 0">
                    <div
                      class="magic"
                      v-for="(item,index) in userList"
                      :key="index"
                      @click="addOr(item)"
                    >
                      <div>{{ item.nickName }}</div>
                      <div>{{item.userName}}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div style="margin:0 auto; text-align:center; margin-top:10px;">ROLL房内无此用户</div>
                  </div>
                </el-form>
                <el-form v-else>
                  <div style="margin:0 auto; text-align:center; margin-top:10px;">请输入用户昵称</div>
                </el-form>
              </el-row>
            </el-form>
          </el-popover>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRollPrizeList,
  namedWinner,
  cancelNamedWinner,
  getzhidinguser,
  roll,
  delRoll,
  rollChange
} from "@/api/skins/ttRoll/api";
export default {
  data() {
    return {
      loading: false,
      formAdd: {},
      orOnselects: {},
      orform: {},
      userList: null,
      allRollUsers: [], // 保存roll房内所有用户，用于本地搜索过滤
      id: Number(this.$route.query.id),
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      loadings: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: null,
        phoneNumber: null,
        status: null,
        certifyId: null,
        userId: null,
        userName: null,
        userType: null
      },
      form: {},
      forms: {
        nickName: null
      }
    };
  },
  watch: {
    dialogFormVisible: {
      handler(aa, bb) {
        if (aa == false) {
          this.form = {};
          this.getList();
          // 关闭弹框时重置搜索条件
          this.queryParams.nickName = null;
          this.userList = null;
        } else {
          // 打开弹框时加载roll房内所有用户
          this.loadAllRollUsers();
        }
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    addOr(res) {
      this.form.nickName = res.nickName;
      this.form.userId = res.userId;
      this.$refs.morePop.doClose();
    },

    handleSubmit() {
      this.form.rollUserId = this.form.userId
      namedWinner(this.form).then(res => {
        this.dialogFormVisible = false;
        this.getList();
        this.$message({
          message: "编辑成功",
          type: "success"
        });
      });
    },
    cancelNamedWinnerMethod(row) {
      console.log(row);
      if (row.rollUserPrizeId) {
        cancelNamedWinner([row.rollUserPrizeId]).then(res => {
          this.getList();
          this.$message({
            message: "取消成功",
            type: "success"
          });
        });
      }
    },
    // 加载roll房内所有用户
    loadAllRollUsers() {
      this.loadings = true;
      getzhidinguser(this.id).then(response => {
        this.allRollUsers = response.data || [];
        this.loadings = false;
        // 加载完成后执行搜索过滤
        this.filterUsers();
      }).catch(() => {
        this.allRollUsers = [];
        this.loadings = false;
        this.userList = [];
      });
    },
    // 搜索过滤roll房内用户
    serchornaments() {
      // 如果还没有加载过roll房用户列表，先加载
      if (this.allRollUsers.length === 0 && this.userList === null) {
        this.loadAllRollUsers();
        return;
      }
      
      // 执行过滤
      this.filterUsers();
    },
    // 根据搜索关键词过滤用户列表
    filterUsers() {
      const searchKeyword = this.queryParams.nickName;
      
      // 如果没有搜索关键词，显示所有roll房内用户
      if (!searchKeyword || searchKeyword.trim() === '') {
        this.userList = this.allRollUsers;
        return;
      }
      
      // 根据昵称或用户名进行本地过滤
      const keyword = searchKeyword.trim().toLowerCase();
      this.userList = this.allRollUsers.filter(user => {
        const nickName = (user.nickName || '').toLowerCase();
        const userName = (user.userName || '').toLowerCase();
        return nickName.includes(keyword) || userName.includes(keyword);
      });
    },

    handleAppoint(res) {
      //校验是否已有中奖者
      console.log("中奖者校验...")
      this.dialogFormVisible = true;
      this.form = res;
    },
    // 滚动加载已移除，因为我们已经一次性加载了所有roll房内用户
    scrollEventFn(e) {
      // 由于已经加载了所有roll房内用户，不需要滚动加载
      // 如果需要分页，可以在这里实现前端分页逻辑
    },
    getList() {
      this.loading = true;
      getRollPrizeList(this.id).then(res => {
        // this.total = res.total;
        this.tableData = res.data;
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.magicbox {
  margin: 0 auto;
  margin-top: 5px;
  height: 300px;
  overflow-y: scroll;
  .magic {
    height: 32px;
    padding: 2px 5px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background-color: #409eff;
      transition: all ease 0.3s;
    }
  }
}
.home {
  padding: 20px;
}
</style>
