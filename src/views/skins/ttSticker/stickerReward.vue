<template>
  <div class="home">
    <el-button type="primary" size="mini" @click="handleAdd()">新增奖励</el-button>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" v-loading="loading" border>
      <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column align="center" prop="rewardName" label="奖励名称" width="200"></el-table-column>
      <el-table-column align="center" prop="stickerRequirement" label="贴纸需求" width="300">
        <template slot-scope="scope">
          <el-tag
            v-for="(req, index) in parseStickerRequirement(scope.row.stickerRequirement)"
            :key="index"
            style="margin-right: 5px; margin-bottom: 5px"
          >
            {{ getStickerName(req.stickerCode) }} x{{ req.quantity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="maxExchangeCount" label="最大兑换次数(每人)" width="180">
        <template slot-scope="scope">
          {{ scope.row.maxExchangeCount || '不限制' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="totalExchangeCount" label="总兑换次数" width="120"></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序" width="80"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="900px">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="奖励名称" prop="rewardName">
          <el-input v-model="form.rewardName" placeholder="请输入奖励名称"></el-input>
        </el-form-item>
        <el-form-item label="贴纸需求">
          <div style="width: 100%">
            <div
              v-for="(req, index) in form.stickerRequirements"
              :key="index"
              style="margin-bottom: 10px; display: flex; align-items: center"
            >
              <el-select v-model="req.stickerCode" placeholder="选择贴纸" style="width: 200px; margin-right: 10px">
                <el-option
                  v-for="sticker in stickerList"
                  :key="sticker.stickerCode"
                  :label="sticker.stickerName"
                  :value="sticker.stickerCode"
                ></el-option>
              </el-select>
              <el-input-number
                v-model="req.quantity"
                :min="1"
                :max="999"
                controls-position="right"
                style="width: 120px; margin-right: 10px"
              ></el-input-number>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeStickerRequirement(index)">删除</el-button>
            </div>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addStickerRequirement">添加贴纸</el-button>
          </div>
        </el-form-item>
        <el-form-item label="最大兑换次数(每人)">
          <el-input-number
            v-model="form.maxExchangeCount"
            :min="1"
            controls-position="right"
            style="width: 200px"
          ></el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 5px; margin-left: 10px; display: inline-block;">
            留空表示不限制，此限制针对每个用户
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            controls-position="right"
            style="width: 200px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖励饰品">
          <div style="width: 100%">
            <el-table :data="form.ornaments" border style="width: 100%; margin-bottom: 10px">
              <el-table-column prop="ornamentName" label="饰品名称" width="200"></el-table-column>
              <el-table-column prop="quantity" label="数量" width="100">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    :min="1"
                    :max="999"
                    controls-position="right"
                    size="small"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="removeOrnament(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="showOrnamentDialog = true">添加饰品</el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="3" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="奖励详情" :visible.sync="viewDialogVisible" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="奖励名称">{{ viewData.rewardName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === '0' ? 'success' : 'danger'">
            {{ viewData.status === '0' ? '启用' : '停用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最大兑换次数(每人)">{{ viewData.maxExchangeCount || '不限制' }}</el-descriptions-item>
        <el-descriptions-item label="总兑换次数">{{ viewData.totalExchangeCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ viewData.sort }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="贴纸需求" :span="2">
          <el-tag
            v-for="(req, index) in parseStickerRequirement(viewData.stickerRequirement)"
            :key="index"
            style="margin-right: 5px"
          >
            {{ getStickerName(req.stickerCode) }} x{{ req.quantity }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="奖励饰品" :span="2">
          <el-table :data="viewData.ornaments" border style="width: 100%">
            <el-table-column prop="ornamentName" label="饰品名称"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 选择饰品对话框 -->
    <el-dialog title="选择饰品" :visible.sync="showOrnamentDialog" width="800px">
      <el-form :inline="true" size="small">
        <el-form-item label="饰品名称">
          <el-input v-model="ornamentQuery.itemName" placeholder="请输入饰品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchOrnaments">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="ornamentTable"
        :data="ornamentList"
        border
        style="width: 100%; margin-top: 10px"
        max-height="400"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="饰品名称"></el-table-column>
        <el-table-column prop="usePrice" label="价格" width="120"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showOrnamentDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectOrnaments">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStickerReward,
  getStickerReward,
  addStickerReward,
  updateStickerReward,
  delStickerReward,
  listSticker
} from "@/api/skins/ttSticker/api";
import { listOrnaments } from "@/api/skins/ttOrnaments/api";

export default {
  name: "StickerReward",
  data() {
    return {
      loading: false,
      dialogTitle: "新增奖励",
      dialogFormVisible: false,
      viewDialogVisible: false,
      showOrnamentDialog: false,
      isEdit: false,
      tableData: [],
      stickerList: [],
      ornamentList: [],
      selectedOrnaments: [],
      ornamentQuery: {
        itemName: ""
      },
      viewData: {},
      form: {
        id: null,
        rewardName: "",
        stickerRequirement: "",
        stickerRequirements: [],
        maxExchangeCount: null,
        sort: 0,
        status: "0",
        ornaments: [],
        remark: ""
      },
      rules: {
        rewardName: [
          { required: true, message: "请输入奖励名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getList();
    this.getStickerList();
  },
  methods: {
    getList() {
      this.loading = true;
      listStickerReward().then(res => {
        this.tableData = res.rows || res.data || [];
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    getStickerList() {
      listSticker().then(res => {
        this.stickerList = res.rows || res.data || [];
      });
    },
    handleAdd() {
      this.dialogTitle = "新增奖励";
      this.isEdit = false;
      this.form = {
        id: null,
        rewardName: "",
        stickerRequirement: "",
        stickerRequirements: [],
        maxExchangeCount: null,
        sort: 0,
        status: "0",
        ornaments: [],
        remark: ""
      };
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = "修改奖励";
      this.isEdit = true;
      getStickerReward(row.id).then(res => {
        const data = res.data;
        this.form = {
          id: data.reward.id,
          rewardName: data.reward.rewardName,
          stickerRequirement: data.reward.stickerRequirement,
          stickerRequirements: this.parseStickerRequirement(data.reward.stickerRequirement),
          maxExchangeCount: data.reward.maxExchangeCount,
          sort: data.reward.sort,
          status: data.reward.status,
          ornaments: data.ornaments || [],
          remark: data.reward.remark || ""
        };
        this.dialogFormVisible = true;
      });
    },
    handleView(row) {
      getStickerReward(row.id).then(res => {
        this.viewData = {
          ...res.data.reward,
          ornaments: res.data.ornaments || []
        };
        this.viewDialogVisible = true;
      });
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除奖励"' + row.rewardName + '"？').then(() => {
        return delStickerReward(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证贴纸需求
          if (this.form.stickerRequirements.length === 0) {
            this.$modal.msgError("请至少添加一个贴纸需求");
            return;
          }
          // 验证每个贴纸需求是否已选择贴纸
          const hasEmptySticker = this.form.stickerRequirements.some(req => !req.stickerCode || req.stickerCode === "");
          if (hasEmptySticker) {
            this.$modal.msgError("请为所有贴纸需求选择贴纸");
            return;
          }
          // 验证奖励饰品
          if (this.form.ornaments.length === 0) {
            this.$modal.msgError("请至少添加一个奖励饰品");
            return;
          }

          const submitData = {
            reward: {
              id: this.form.id,
              rewardName: this.form.rewardName,
              stickerRequirement: JSON.stringify(this.form.stickerRequirements),
              maxExchangeCount: this.form.maxExchangeCount,
              sort: this.form.sort,
              status: this.form.status,
              remark: this.form.remark
            },
            ornaments: this.form.ornaments.map(item => ({
              ornamentId: item.ornamentId,
              ornamentName: item.ornamentName,
              quantity: item.quantity
            }))
          };

          if (this.isEdit) {
            updateStickerReward(submitData).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            addStickerReward(submitData).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    addStickerRequirement() {
      this.form.stickerRequirements.push({
        stickerCode: "",
        quantity: 1
      });
    },
    removeStickerRequirement(index) {
      this.form.stickerRequirements.splice(index, 1);
    },
    addOrnament() {
      this.showOrnamentDialog = true;
      this.searchOrnaments();
    },
    searchOrnaments() {
      listOrnaments(this.ornamentQuery).then(res => {
        this.ornamentList = res.data?.records || [];
      });
    },
    confirmSelectOrnaments() {
      const selected = this.$refs.ornamentTable.selection;
      if (!selected || selected.length === 0) {
        this.$modal.msgWarning("请至少选择一个饰品");
        return;
      }
      selected.forEach(item => {
        const exists = this.form.ornaments.find(o => o.ornamentId === item.id);
        if (!exists) {
          this.form.ornaments.push({
            ornamentId: item.id,
            ornamentName: item.name,
            quantity: 1
          });
        }
      });
      this.showOrnamentDialog = false;
    },
    removeOrnament(index) {
      this.form.ornaments.splice(index, 1);
    },
    parseStickerRequirement(requirement) {
      if (!requirement) return [];
      try {
        return JSON.parse(requirement);
      } catch (e) {
        return [];
      }
    },
    getStickerName(stickerCode) {
      if (!stickerCode) return stickerCode;
      const sticker = this.stickerList.find(s => s.stickerCode === stickerCode);
      return sticker ? sticker.stickerName : stickerCode;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
</style>
