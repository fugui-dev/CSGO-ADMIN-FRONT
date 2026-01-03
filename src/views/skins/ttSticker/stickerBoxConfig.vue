<template>
  <div class="home">
    <el-form :inline="true" :model="queryParams" size="small" class="search-form">
      <el-form-item label="箱子ID">
        <el-input
          v-model="queryParams.boxId"
          clearable
          placeholder="请输入箱子ID"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="配置类型">
        <el-select v-model="queryParams.configType" placeholder="请选择" clearable style="width: 200px">
          <el-option
            v-for="item in configTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" size="mini" @click="handleAdd()">新增配置</el-button>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" v-loading="loading" border>
      <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column align="center" prop="boxId" label="箱子ID" width="100"></el-table-column>
      <el-table-column align="center" prop="boxName" label="箱子名称" width="150"></el-table-column>
      <el-table-column align="center" prop="stickerCode" label="贴纸编码" width="120"></el-table-column>
      <el-table-column align="center" prop="stickerName" label="贴纸名称" width="150"></el-table-column>
      <el-table-column align="center" prop="configType" label="配置类型" width="180">
        <template slot-scope="scope">
          {{ getConfigTypeName(scope.row.configType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="箱子" prop="boxId">
          <el-select
            v-model="form.boxId"
            placeholder="请选择箱子"
            filterable
            style="width: 100%"
            @change="handleBoxChange"
          >
            <el-option
              v-for="box in boxList"
              :key="box.boxId"
              :label="box.boxName"
              :value="box.boxId"
            >
              <span>{{ box.boxName }} (ID: {{ box.boxId }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="贴纸" prop="stickerId">
          <el-select
            v-model="form.stickerId"
            placeholder="请选择贴纸"
            filterable
            style="width: 100%"
            @change="handleStickerChange"
          >
            <el-option
              v-for="sticker in stickerList"
              :key="sticker.id"
              :label="sticker.stickerName"
              :value="sticker.id"
            >
              <span>{{ sticker.stickerName }} ({{ sticker.stickerCode }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="贴纸编码" prop="stickerCode">
          <el-input v-model="form.stickerCode" placeholder="自动从贴纸获取" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置类型">
          <el-input v-model="configTypeName" placeholder="自动从贴纸获取" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script>
import {
  listStickerBoxConfig,
  addStickerBoxConfig,
  updateStickerBoxConfig,
  delStickerBoxConfig,
  listSticker
} from "@/api/skins/ttSticker/api";
import { listBox } from "@/api/skins/ttBox/api";

export default {
  name: "StickerBoxConfig",
  data() {
    return {
      loading: false,
      dialogTitle: "新增贴纸箱子配置",
      dialogFormVisible: false,
      isEdit: false,
      tableData: [],
      queryParams: {
        boxId: null,
        configType: null
      },
      form: {
        id: null,
        boxId: null,
        stickerId: null,
        stickerCode: "",
        configType: null,
        status: "0",
        remark: ""
      },
      boxList: [],
      stickerList: [],
      configTypeName: "",
      rules: {
        boxId: [
          { required: true, message: "请选择箱子", trigger: "change" }
        ],
        stickerId: [
          { required: true, message: "请选择贴纸", trigger: "change" }
        ]
      },
      configTypeOptions: [
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
    // 先获取箱子和贴纸列表，再获取配置列表
    Promise.all([this.getBoxList(), this.getStickerList()]).then(() => {
      this.getList();
    });
  },
  methods: {
    getList() {
      this.loading = true;
      listStickerBoxConfig(this.queryParams).then(res => {
        const list = res.rows || res.data || [];
        // 关联箱子和贴纸信息
        this.tableData = list.map(item => {
          const box = this.boxList.find(b => b.boxId === item.boxId);
          const sticker = this.stickerList.find(s => s.id === item.stickerId);
          return {
            ...item,
            boxName: box ? box.boxName : '',
            stickerName: sticker ? sticker.stickerName : ''
          };
        });
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.queryParams = {
        boxId: null,
        configType: null
      };
      this.getList();
    },
    handleAdd() {
      this.dialogTitle = "新增贴纸箱子配置";
      this.isEdit = false;
      this.form = {
        id: null,
        boxId: null,
        stickerId: null,
        stickerCode: "",
        configType: null,
        status: "0",
        remark: ""
      };
      this.configTypeName = "";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleEdit(row) {
      this.dialogTitle = "修改贴纸箱子配置";
      this.isEdit = true;
      this.form = { ...row };
      // 设置配置类型名称
      this.configTypeName = this.getConfigTypeName(row.configType);
      // 确保箱子和贴纸列表已加载
      Promise.all([
        this.boxList.length === 0 ? this.getBoxList() : Promise.resolve(),
        this.stickerList.length === 0 ? this.getStickerList() : Promise.resolve()
      ]).then(() => {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.clearValidate();
          }
        });
      });
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该配置？').then(() => {
        return delStickerBoxConfig(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateStickerBoxConfig(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            addStickerBoxConfig(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    getConfigTypeName(type) {
      const option = this.configTypeOptions.find(item => item.value === type);
      return option ? option.label : "未知";
    },
    getBoxList() {
      return new Promise((resolve) => {
        // 传递较大的pageSize以获取所有箱子列表
        listBox({ status: "0", pageNum: 1, pageSize: 10000 }).then(res => {
          this.boxList = res.rows || res.data || [];
          resolve();
        }).catch(() => {
          resolve();
        });
      });
    },
    getStickerList() {
      return new Promise((resolve) => {
        // 传递较大的pageSize以获取所有贴纸列表
        listSticker({ status: "0", pageNum: 1, pageSize: 10000 }).then(res => {
          this.stickerList = res.rows || res.data || [];
          resolve();
        }).catch(() => {
          resolve();
        });
      });
    },
    handleBoxChange(boxId) {
      // 箱子改变时的处理
      if (boxId) {
        const box = this.boxList.find(b => b.boxId === boxId);
        if (box) {
          // 可以在这里做一些处理
        }
      }
    },
    handleStickerChange(stickerId) {
      // 贴纸改变时，自动填充贴纸编码和配置类型
      if (stickerId) {
        const sticker = this.stickerList.find(s => s.id === stickerId);
        if (sticker) {
          this.form.stickerCode = sticker.stickerCode;
          this.form.configType = sticker.stickerType;
          this.configTypeName = this.getConfigTypeName(sticker.stickerType);
        }
      } else {
        this.form.stickerCode = "";
        this.form.configType = null;
        this.configTypeName = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
</style>
