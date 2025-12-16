<template>
  <div class="home">
    <el-button type="primary" size="mini" @click="handleAdd()">新增贴纸</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" border>
      <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column align="center" prop="stickerCode" label="贴纸编码" width="120"></el-table-column>
      <el-table-column align="center" prop="stickerName" label="贴纸名称" width="150"></el-table-column>
      <el-table-column align="center" prop="stickerImage" label="贴纸图片" width="120">
        <template slot-scope="scope">
          <image-preview :src="scope.row.stickerImage" :width="50" :height="50" v-if="scope.row.stickerImage"></image-preview>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stickerType" label="贴纸类型" width="150">
        <template slot-scope="scope">
          {{ getStickerTypeName(scope.row.stickerType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="贴纸编码" prop="stickerCode">
          <el-input v-model="form.stickerCode" placeholder="例如：red" :disabled="isEdit"></el-input>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            唯一标识，建议使用英文小写
          </div>
        </el-form-item>
        <el-form-item label="贴纸名称" prop="stickerName">
          <el-input v-model="form.stickerName" placeholder="例如：红色贴纸"></el-input>
        </el-form-item>
        <el-form-item label="绑定网站道具" prop="websiteProperty">
          <el-select
            v-model="selectedWebsitePropertyId"
            placeholder="请选择绑定的网站道具"
            filterable
            style="width: 100%"
            @change="handleWebsitePropertyChange"
          >
            <el-option
              v-for="item in websitePropertyList"
              :key="item.ornamentId"
              :label="item.ornamentName + '（ID：' + item.ornamentId + '）'"
              :value="item.ornamentId"
            >
              <span>{{ item.ornamentName }}（ID：{{ item.ornamentId }}）</span>
            </el-option>
          </el-select>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            贴纸图片从网站道具同步，这里只选择道具，不再单独上传图片
          </div>
        </el-form-item>
        <el-form-item label="贴纸类型" prop="stickerType">
          <el-select v-model="form.stickerType" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in stickerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" :rows="3" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSticker,
  getSticker,
  addSticker,
  updateSticker,
  delSticker
} from "@/api/skins/ttSticker/api";
import { getWebsiteProperty } from "@/api/skins/ttOrnaments/api";
import ImagePreview from "@/components/ImagePreview";

export default {
  name: "Sticker",
  components: {
    ImagePreview
  },
  data() {
    return {
      loading: false,
      dialogTitle: "新增贴纸",
      dialogFormVisible: false,
      isEdit: false,
      tableData: [],
      form: {
        id: null,
        stickerCode: "",
        stickerName: "",
        stickerColor: "",
        stickerImage: "",
        stickerType: null,
        description: "",
        status: "0"
      },
      // 绑定的网站道具
      websitePropertyList: [],
      selectedWebsitePropertyId: null,
      rules: {
        stickerCode: [
          { required: true, message: "请输入贴纸编码", trigger: "blur" }
        ],
        stickerName: [
          { required: true, message: "请输入贴纸名称", trigger: "blur" }
        ],
        stickerType: [
          { required: true, message: "请选择贴纸类型", trigger: "change" }
        ]
      },
      stickerTypeOptions: [
        { label: "对战胜利", value: 1 },
        { label: "对战失败", value: 2 },
        { label: "连续登录7天", value: 3 },
        { label: "连续充值100金币7天", value: 4 },
        { label: "开箱获得黑色", value: 5 },
        { label: "开箱获得蓝色", value: 6 },
        { label: "开箱获得绿色", value: 7 },
        { label: "开箱获得粉色", value: 8 },
        { label: "开箱获得灰色", value: 9 },
        { label: "开箱获得金色", value: 10 }
      ]
    };
  },
  mounted() {
    this.getList();
    this.loadWebsitePropertyList();
  },
  methods: {
    getList() {
      this.loading = true;
      listSticker().then(res => {
        this.tableData = res.rows || res.data || [];
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleAdd() {
      this.dialogTitle = "新增贴纸";
      this.isEdit = false;
      this.form = {
        id: null,
        stickerCode: "",
        stickerName: "",
        stickerColor: "",
        stickerImage: "",
        stickerType: null,
        description: "",
        status: "0"
      };
      this.selectedWebsitePropertyId = null;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleEdit(row) {
      this.dialogTitle = "修改贴纸";
      this.isEdit = true;
      getSticker(row.id).then(res => {
        this.form = { ...res.data };
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.clearValidate();
          }
        });
      });
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除贴纸"' + row.stickerName + '"？').then(() => {
        return delSticker(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateSticker(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            addSticker(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    getStickerTypeName(type) {
      const option = this.stickerTypeOptions.find(item => item.value === type);
      return option ? option.label : "未知";
    },
    // 加载网站道具列表
    loadWebsitePropertyList() {
      getWebsiteProperty({ pageNum: 1, pageSize: 1000 }).then(res => {
        this.websitePropertyList = res.rows || res.data || [];
      });
    },
    // 选择网站道具后，同步贴纸图片
    handleWebsitePropertyChange(ornamentId) {
      const item = this.websitePropertyList.find(p => p.ornamentId === ornamentId);
      if (item) {
        this.form.stickerImage = item.ornamentImgUrl || "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
</style>
