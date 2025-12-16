<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" size="small">
      <el-form-item label="宝箱ID" prop="boxName">
        <el-input
          v-model="queryParams.boxId"
          clearable
          placeholder="请输入宝箱ID"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="宝箱名称" prop="boxName">
        <el-input
          v-model="queryParams.boxName"
          clearable
          placeholder="请输入宝箱名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否对战宝箱" prop="price">
        <el-select v-model="queryParams.isFight" placeholder="请选择" clearable>
          <el-option key="0" label="是" value="0" />
          <el-option key="1" label="否" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="宝箱状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option key="0" label="正常" value="0" />
          <el-option key="1" label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:box:add']"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:box:edit']"
          :disabled="single"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:box:remove']"
          :disabled="multiple"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:box:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="boxList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="id" prop="boxId" width="55" />
      <el-table-column align="center" label="宝箱名称" prop="boxName">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-discount"
            @click="handleWatch(1,scope.row)"
          >{{ scope.row.boxName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱所属分类">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-select v-model="scope.row.boxTypeId" placeholder="请选择">
                  <el-option
                    v-for="item in Typelist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="handleR">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button slot="reference" type="text" class="under">{{scope.row.boxTypeName || '未分配'}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱价格" prop="price">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-input v-model="scope.row.price" clearable></el-input>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="handleR">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button slot="reference" type="text" class="under">{{scope.row.price}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱图片01" prop="boxImg01">
        <template slot-scope="scope">
          <image-preview :src="scope.row.boxImg01" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱图片02" prop="boxImg02">
        <template slot-scope="scope">
          <image-preview :src="scope.row.boxImg02" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱排序" prop="sort">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-input v-model="scope.row.sort" clearable></el-input>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="handleR">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button slot="reference" type="text" class="under">{{scope.row.sort}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否对战宝箱" prop="isFight">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <el-row>
              <div style="text-align: center;">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleChangeFight(scope.row,1)"
                  :disabled="scope.row.isFight == 1"
                >否</el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleChangeFight(scope.row,0)"
                  :disabled="scope.row.isFight == 0"
                >是</el-button>
              </div>
            </el-row>
            <el-button slot="reference" type="text" class="under">
              <span v-if="scope.row.isFight == 0 ">是</span>
              <span v-else>否</span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="宝箱状态" prop="status">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <el-row>
              <div style="text-align: center;">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleChangeStatus(scope.row,1)"
                  :disabled="scope.row.status == 1"
                >停用</el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleChangeStatus(scope.row,0)"
                  :disabled="scope.row.status == 0"
                >正常</el-button>
              </div>
            </el-row>
            <el-button slot="reference" type="text" class="under">
              <span v-if="scope.row.status == 0 ">正常</span>
              <span v-else>停用</span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="幸运区间" prop="luckInterval" /> -->
      <!-- <el-table-column align="center" label="幸运区间(主播)" prop="luckIntervalAnchor" /> -->
      <!-- <el-table-column align="center" label="满幸运值需要次数" prop="luckyNum" /> -->
      <el-table-column align="center" label="是否推荐" prop="isHome">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <el-row>
              <div style="text-align: center;">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleChangeHome(scope.row,1)"
                  :disabled="scope.row.isHome == 1"
                >否</el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleChangeHome(scope.row,0)"
                  :disabled="scope.row.isHome == 0"
                >是</el-button>
              </div>
            </el-row>
            <el-button slot="reference" type="text" class="under">
              <span v-if="scope.row.isHome == 0 ">是</span>
              <span v-else>否</span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="每轮花费金额" prop="amountConsumed" />
      <el-table-column align="center" label="箱内饰品总价值" prop="aggregateAmount" />
      <el-table-column align="center" label="每轮利润" prop="profit" />
      <el-table-column align="center" label="每轮利润率" prop="profitMargin" />
      <el-table-column label="实际利润率" align="center" prop="actualProfitMargin" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.actualProfitMargin != null" :style="{ color: scope.row.actualProfitMargin >= 0 ? '#67C23A' : '#F56C6C' }">
            {{ scope.row.actualProfitMargin }}%
          </span>
          <span v-else style="color: #909399;">-</span>
        </template>
      </el-table-column>
      <el-table-column label="宝箱开启次数" align="center" prop="openNum" width="100" />
      <el-table-column label="添加价值高的饰品开箱次数" align="center" prop="highValueOpenNum" width="140">
      </el-table-column>
      <el-table-column label="必中价值高的饰品开箱次数" align="center" prop="mustHighValueOpenNum" width="140">
      </el-table-column>
      <el-table-column label="目标利润率" align="center" prop="targetProfitMargin" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.targetProfitMargin != null">{{ scope.row.targetProfitMargin }}%</span>
          <span v-else style="color: #909399;">-</span>
        </template>
      </el-table-column>
      <el-table-column label="启用利润率控制" align="center" prop="profitControlEnabled" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.profitControlEnabled === 1" type="success" size="small">启用</el-tag>
          <el-tag v-else-if="scope.row.profitControlEnabled === 0" type="info" size="small">禁用</el-tag>
          <span v-else style="color: #909399;">-</span>
        </template>
      </el-table-column>
      <el-table-column label="统计窗口大小" align="center" prop="profitWindowSize" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.profitWindowSize != null && scope.row.profitWindowSize > 0">{{ scope.row.profitWindowSize }}次</span>
          <span v-else style="color: #909399;">全部历史</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleCount(scope.row)">统计</el-button>

          <el-dropdown size="mini">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="handleResetBox(scope.row)">重置宝箱</el-dropdown-item>
              <el-dropdown-item @click.native="handleAddPrize(scope.row)">批量填货</el-dropdown-item>
              <el-dropdown-item @click.native="handleWatch(2,scope.row)">查看奖项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改宝箱数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="宝箱名称" prop="boxName">
          <el-input v-model="form.boxName" placeholder="请输入宝箱名称" />
        </el-form-item>
        <el-form-item label="宝箱价格" prop="price" class="number">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="宝箱分类" prop="boxTypeId">
          <el-select v-model="form.boxTypeId" placeholder="请选择">
            <el-option v-for="item in Typelist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宝箱图片01" prop="boxImg01">
          <image-upload v-model="form.boxImg01" :file-type="['png', 'jpg', 'jpeg', 'gif']" :file-size="10" />
        </el-form-item>
        <el-form-item label="宝箱图片02" prop="boxImg02">
          <image-upload v-model="form.boxImg02" :file-type="['png', 'jpg', 'jpeg', 'gif']" :file-size="10" />
        </el-form-item>
        <el-form-item label="宝箱排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="1000" label="请选择"></el-input-number>
        </el-form-item>
        <el-form-item label="是否对战宝箱" prop="isFight">
          <el-switch
            v-model="form.isFight"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="宝箱状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="正常"
            inactive-text="停用"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否首页推荐" prop="isHome">
          <el-switch
            v-model="form.isHome"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="是"
            inactive-text="否"
            @change="hh()"
          ></el-switch>
        </el-form-item>
        <el-form-item label="宝箱开启次数" prop="openNum">
          <el-input v-model="form.openNum" placeholder="请输入宝箱开启次数" style="width: 220px" />
        </el-form-item>
        <el-form-item label="添加价值高的饰品开箱次数" prop="highValueOpenNum">
          <el-input v-model="form.highValueOpenNum" placeholder="请输入添加价值高的饰品开箱次数" style="width: 220px" />
        </el-form-item>
        <el-form-item label="必中价值高的饰品开箱次数" prop="mustHighValueOpenNum">
          <el-input v-model="form.mustHighValueOpenNum" placeholder="请输入必中价值高的饰品开箱次数" style="width: 220px" />
        </el-form-item>
        <el-form-item label="目标利润率" prop="targetProfitMargin">
          <el-input-number 
            v-model="form.targetProfitMargin" 
            :precision="2" 
            :step="0.1" 
            :min="0" 
            :max="100"
            placeholder="请输入目标利润率（百分比）" 
            style="width: 220px"
          ></el-input-number>
          <span style="margin-left: 10px; color: #909399;">%</span>
        </el-form-item>
        <el-form-item label="启用利润率控制" prop="profitControlEnabled">
          <el-switch
            v-model="form.profitControlEnabled"
            :active-value="1"
            :inactive-value="0"
            active-color="#13CE66"
            inactive-color="#FF4949"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
        <el-form-item label="统计窗口大小" prop="profitWindowSize">
          <el-input-number 
            v-model="form.profitWindowSize" 
            :min="0" 
            :max="100000"
            placeholder="留空表示使用所有历史数据" 
            style="width: 220px"
          ></el-input-number>
          <span style="margin-left: 10px; color: #909399;">次（留空=使用所有历史数据）</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 箱内详情 -->
    <el-dialog :title="titleOr" :visible.sync="openPrize" width="80%">
      <el-table :data="gridData" v-loading="loadings">
        <el-table-column align="center" property="id" label="id"></el-table-column>
        <el-table-column align="center" property="itemName" label="名称"></el-table-column>
        <el-table-column align="center" property="level" label="颜色"></el-table-column>
        <el-table-column align="center" property="usePrice" label="金额"></el-table-column>
        <el-table-column align="center" property="address" label="封面">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt width="40px" height="40px" referrerpolicy="no-referrer" />
          </template>
        </el-table-column>
        <el-table-column align="center" property="oddsPercentum" label="爆率"></el-table-column>
        <el-table-column align="center" label="饰品">
          <el-table-column align="center" property="odds" label="数量"></el-table-column>
          <el-table-column align="center" property="oddsPercentum" label="爆率"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="主播饰品">
          <el-table-column align="center" property="anchorOdds" label="数量"></el-table-column>
          <el-table-column align="center" property="anchorOddsPercentum" label="爆率"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="幸运饰品">
          <el-table-column align="center" property="luckOdds" label="数量"></el-table-column>
          <el-table-column align="center" property="luckOddsPercentum" label="爆率"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="真实饰品">
          <el-table-column align="center" property="realOdds" label="数量"></el-table-column>
          <el-table-column align="center" property="realOddsPercentum" label="爆率"></el-table-column>
        </el-table-column>
        <el-table-column align="center" property="isLuck" label="幸运物品">
          <template slot-scope="scope">
            <span v-if="scope.row.isLuck == 1">是</span>
            <span v-if="scope.row.isLuck == 0">否</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalPrize>0"
        :limit.sync="queryPrize.pageSize"
        :page.sync="queryPrize.pageNum"
        :total="totalPrize"
        @pagination="getListPrize"
      />
    </el-dialog>
    <!-- 新增奖项 -->
    <el-dialog title="批量填货" :visible.sync="dialogFormVisible" width="85%">
      <el-form :model="formPrize">
        <el-form-item label="宝箱" :label-width="formLabelWidth">
          <el-select v-model="formPrize.boxId" placeholder="请选择宝箱">
            <el-option
              v-for="item in boxList"
              :key="item.boxId"
              :label="item.boxName"
              :value="item.boxId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-tabs v-model="activeName" type="card" @tab-click="tabclick">
          <el-tab-pane label="选择饰品" name="first">
            <el-form ref="queryForm" :inline="true" :model="orform" label-width="68px" size="small">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="饰品ID" class="orform">
                    <el-input v-model="orform.id" placeholder="请输入饰品ID" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="饰品名称" class="orform">
                    <el-input v-model="orform.itemName" placeholder="请输入饰品名称" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="外观" class="orform">
                    <el-select v-model="orform.exterior" placeholder="请选择" clearable>
                      <el-option
                        v-for="dict in dict.type.ornaments_exterior_name"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="类型" class="orform">
                    <el-select v-model="orform.type" placeholder="请选择" clearable>
                      <el-option
                        v-for="dict in dict.type.ornaments_type_name"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="价格区间 " class="orform max">
                    <div style="display:flex;">
                      <el-input v-model="orform.minPrice" placeholder="最小值" clearable></el-input>
                      <div style="width: 50px; "></div>
                      <el-input v-model="orform.maxPrice" placeholder="最大值" clearable></el-input>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button
                      icon="el-icon-search"
                      size="mini"
                      type="primary"
                      @click="orhandleClick"
                    >搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="orresetQuery">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <el-table
              :data="orList"
              style="width: 100%"
              @selection-change="selectPrize"
              v-loading="loadings"
            >
              <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
              <el-table-column align="center" prop="name" label="名称" width="350"></el-table-column>
              <el-table-column align="center" prop="usePrice" label="价格"></el-table-column>
              <el-table-column align="center" prop="quantity" label="在售数量"></el-table-column>
              <el-table-column align="center" label="外观名称" prop="exteriorName">
                <template slot-scope="scope">{{ scope.row.exteriorName || '无涂装' }}</template>
              </el-table-column>
              <el-table-column align="center" label="稀有度">
                <template slot-scope="scope">
                  <el-tag
                    :color="scope.row.rarityColor"
                    style="color: #fff;"
                  >{{ scope.row.rarityName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="封面">
                <template slot-scope="scope">
                  <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="类型">
                <template slot-scope="scope">
                  <el-tag>{{ scope.row.typeName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="更新时间" prop="updateTime" />
            </el-table>

            <pagination
              v-show="ortotal>0"
              :limit.sync="orform.pageSize"
              :page.sync="orform.pageNum"
              :total="ortotal"
              @pagination="serchornaments"
            />
          </el-tab-pane>
          <el-tab-pane label="选择道具" name="second" v-if="false">
            <el-table
              :data="orList"
              style="width: 100%"
              @selection-change="selectPrize"
              v-loading="loadings"
            >
              <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
              <el-table-column align="center" label="道具名称" prop="itemName" />
              <el-table-column align="center" label="道具图片" prop="levelImg">
                <template slot-scope="scope">
                  <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="道具价格" prop="usePrice" />
              <el-table-column align="center" label="创建时间" prop="createTime" />
            </el-table>

            <pagination
              v-show="ortotal>0"
              :limit.sync="orform.pageSize"
              :page.sync="orform.pageNum"
              :total="ortotal"
              @pagination="serchornaments"
            />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitone">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 统计 -->
    <el-dialog title="宝箱统计" :visible.sync="countVisible" width="600px">
      <el-row>
        <el-col :span="12">
          <div class="box1">
            本轮剩余饰品数量:
            <span class="box2">{{ countData.remainingNum }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align: right;">
        查询日期:
        <el-date-picker
          v-model="countParams.date"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="getCount"
        ></el-date-picker>
      </el-row>
      <el-row style="display: flex;   justify-content: center;">
        <div id="main"></div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBox,
  delBox,
  getBox,
  listBox,
  updateBox,
  boxTypelist,
  boxChange,
  getBoxOrnaments,
  addBoxOrnaments,
  batchAdd,
  resetBox,
  countBox
} from "@/api/skins/ttBox/api";
import { listOrnaments, getWebsiteProperty } from "@/api/skins/ttOrnaments/api";
import { listLevel } from "@/api/skins/ttOrnamentsLevel/api";
import * as echarts from "echarts";

export default {
  name: "Box",
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  data() {
    return {
      countParams: {
        date: new Date(),
        boxId: null
      },
      countData: {},
      activeName: "first",
      dialogFormVisible: false,
      countVisible: false,
      totalPrize: 1,
      ortotal: 1,
      titleOr: "",
      gridData: [],
      openPrize: false,
      form_change: {},
      //
      Typelist: [],
      levelList: [],
      // 遮罩层
      loading: true,
      loadings: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 宝箱数据表格数据
      boxList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      queryPrize: {
        pageNum: 1,
        pageSize: 10,
        boxId: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boxName: null,
        boxType: null,
        price: null,
        boxImg01: null,
        boxImg02: null,
        sort: null,
        isFight: this.$route.query.isFight,
        status: null,
        luckInterval: null,
        luckIntervalAnchor: null,
        luckyNum: null,
        openNum: null,
        highValueOpenNum: null,
        mustHighValueOpenNum: null
      },
      // 表单参数
      form: {},
      formPrize: {
        boxId: null,
        anchorOdds: 0,
        isLuck: 0,
        ornamentsLevelId: null,
        luckOdds: 0,
        odds: 0,
        ornamentsId: null,
        realOdds: 0
      },
      formLabelWidth: "120px",
      orform: {
        itemName: null,
        pageNum: 1,
        pageSize: 10
      },
      orList: [],
      orOnselects: { itemName: "" },
      formAdd: {},
      // 表单校验
      rules: {
        boxName: [
          { required: true, message: "宝箱名称不能为空", trigger: "blur" }
        ],
        boxTypeId: [
          { required: true, message: "宝箱所属分类不能为空", trigger: "change" }
        ],
        price: [
          { required: true, message: "宝箱价格不能为空", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 10000,
            message: "请输入合理的价格",
            trigger: "blur"
          }
        ],
        sort: [
          { required: true, message: "宝箱排序不能为空", trigger: "blur" }
        ],
        isFight: [
          { required: true, message: "是否对战宝箱不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "宝箱状态不能为空", trigger: "change" }
        ],
        openNum: [
          { required: true, message: "宝箱开启次数不能为空", trigger: "blur" }
        ],
        isHome: [{ required: true, message: "请选择是否推荐", trigger: "blur" }]
      },
      prizeIds: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "二天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            }
          },
          {
            text: "三天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", date);
            }
          },
          {
            text: "四天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 4);
              picker.$emit("pick", date);
            }
          },
          {
            text: "五天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 5);
              picker.$emit("pick", date);
            }
          },
          {
            text: "六天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", date);
            }
          },
          {
            text: "七天前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    initEcharts(day, res) {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: "category",
          data: [day]
        },
        legend: {
          data: ["日出货总金额", "日开启次数", "日利润"]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [res.todayArisePriceTotal],
            type: "bar",
            name: "日出货总金额",

            label: {
              show: true,
              position: "top",
              formatter: "日出货总金额：" + "{c}"
            }
          },
          {
            data: [res.todayProfit],
            type: "bar",
            name: "日利润",
            label: {
              show: true,
              position: "top",
              formatter: "日利润：" + "{c}"
            }
          },
          {
            data: [res.todayOpenNum],
            type: "bar",
            name: "日开启次数",
            label: {
              show: true,
              position: "top",
              formatter: "日开启次数：" + "{c}"
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
    getCount() {
      this.countVisible = true;

      countBox(this.countParams.boxId, this.countParams.date).then(res => {
        this.countData = res.data;
        this.initEcharts(this.countParams.date, res.data);
      });
    },
    handleCount(res) {
      this.countParams.boxId = res.boxId;
      this.countVisible = true;

      this.countParams.date = null;
      countBox(res.boxId, this.countParams.date).then(res => {
        let m = new Date().getMonth() + 1;
        let d = new Date().getDate();
        let y = new Date().getFullYear();
        let day = y + "-" + m + "-" + d;
        this.countData = res.data;

        this.initEcharts(day, res.data);
      });
    },
    handleResetBox(res) {
      this.$confirm("确定重置宝箱 " + res.boxName + " 吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetBox(res.boxId).then(res => {
            this.getList();
            this.$message({
              type: "success",
              message: "重置成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });

    },
    orhandleClick() {
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
        return;
      }
    },
    orresetQuery() {
      this.orform = {};
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
      }
    },
    selectPrize(selection) {
      this.prizeIds = selection.map(item => item.id);
    },
    tabclick() {
      // alert("66");
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
        return;
      }
    },
    handleSubmitone() {
      let data = {
        boxId: this.formPrize.boxId,
        ornamentIds: this.prizeIds
      }
      batchAdd(data).then(res => {
        this.dialogFormVisible = false;
        this.$modal.msgSuccess("添加成功");
      });
    },

    popHidden() {
      this.orform.itemName = "";
    },
    popShow() {
      this.serchornaments();
    },
    addOr(res) {
      this.formPrize.ornamentsId = res.id;
      this.orOnselect = res;
      this.orOnselects.itemName = res.itemName + "   -   ￥" + res.usePrice;
      this.orform.itemName = null;
      this.orList = null;
      this.$refs.morePop.doClose();
    },
    serchprop() {
      this.loadings = true;
      getWebsiteProperty(this.orform).then(res => {
        this.orList = res.rows;
        this.loadings = false;
        this.ortotal = res.total;
      });
    },
    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.orList = res.data.records;
        this.loadings = false;
        this.ortotal = res.data.total;
      });
    },
    scrollEventFn(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.clientHeight >=
        e.srcElement.scrollHeight
      ) {
        this.orform.pageNum += 1;
        listOrnaments(this.orform).then(res => {
          this.orList.push.apply(this.orList, res.data?.records || []);
        });
      }
    },
    handleAddPrize(res) {
      this.serchornaments();
      this.dialogFormVisible = true;
      this.formPrize.boxId = res.boxId;
      listLevel(this.queryParams).then(response => {
        this.levelList = response.rows;
      });
    },
    hh() {
    },
    handleCreatFight() {
    },
    // 快捷查看箱子内饰品
    getListPrize() {
      getBoxOrnaments(this.queryPrize).then(res => {
        this.gridData = res.rows;
        this.totalPrize = res.total;
      });
    },
    handleWatch(type, res) {
      if (type == 1) {
        this.titleOr = res.boxName;
        this.queryPrize.boxId = res.boxId;
        this.loadings = true;
        getBoxOrnaments(
          res.boxId,
          this.queryPrize.pageNum,
          this.queryPrize.pageSize
        ).then(res => {
          this.openPrize = true;
          this.gridData = res.rows;
          this.totalPrize = res.total;
          this.loadings = false;
        });
      } else if (type == 2) {
        this.$router.push({
          path: "/box/boxrPize",
          query: {
            id: res.boxId
          }
        });
      }
    },
    handleR() {
      document.body.click();
    },
    handleChangeFight(res, a) {
      let data = res;
      // data.boxImg01 = "";
      // data.boxImg02 = "";
      data.isFight = a;
      boxChange(data).then(res => {
        this.$modal.msgSuccess("修改成功");
        this.getList();
      });
      document.body.click();
    },
    handleChangeHome(res, a) {
      let data = res;
      // data.boxImg01 = "";
      // data.boxImg02 = "";
      data.isHome = a;
      boxChange(data).then(res => {
        this.$modal.msgSuccess("修改成功");
        this.getList();
      });
      document.body.click();
    },
    handleChangeStatus(res, a) {
      let data = res;
      // data.boxImg01 = "";
      // data.boxImg02 = "";
      data.status = a;
      boxChange(data).then(res => {
        this.$modal.msgSuccess("修改成功");
        this.getList();
      });
      document.body.click();
    },
    handleChangeType(res) {
      let data = res;
      // data.boxImg01 = "";
      // data.boxImg02 = "";
      boxChange(data).then(res => {
        this.$modal.msgSuccess("修改成功");
        this.getList();
      });
      document.body.click();
    },
    /** 查询宝箱数据列表 */
    getList() {
      this.loading = true;
      listBox(this.queryParams).then(response => {
        this.boxList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      boxTypelist().then(res => {
        res.rows.forEach(ele => {
          ele.id = ele.id.toString();
        });
        this.Typelist = res.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        boxId: null,
        boxName: null,
        boxType: null,
        price: null,
        boxImg01: null,
        boxImg02: null,
        sort: null,
        isFight: null,
        status: null,
        luckInterval: null,
        luckIntervalAnchor: null,
        luckyNum: null,
        openNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        targetProfitMargin: 30.00,
        profitControlEnabled: 1,
        profitWindowSize: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      (this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        boxName: null,
        boxType: null,
        price: null,
        boxImg01: null,
        boxImg02: null,
        sort: null,
        isFight: null,
        status: null,
        luckInterval: null,
        luckIntervalAnchor: null,
        luckyNum: null,
        openNum: null,
        highValueOpenNum: null,
        mustHighValueOpenNum: null
      }),
        this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.boxId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      (this.form.isHome = "0"),
        (this.form.status = "0"),
        (this.form.isFight = "0"),
        (this.form.targetProfitMargin = 30.00),
        (this.form.profitControlEnabled = 1),
        (this.form.profitWindowSize = null);
      this.title = "添加宝箱数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const boxId = row.boxId || this.ids;
      getBox(boxId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改宝箱数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.boxId != null) {
            updateBox(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBox(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const boxIds = row.boxId || this.ids;
      this.$modal
        .confirm('是否确认删除宝箱数据编号为"' + boxIds + '"的数据项？')
        .then(function() {
          return delBox(boxIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/box/export",
        {
          ...this.queryParams
        },
        `box_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep.number {
  .el-input--medium {
    width: 100px;
  }
  .el-input__inner {
    padding: 0;
  }
  .el-input-number__increase {
    display: none;
  }
  .el-input-number__decrease {
    display: none;
  }
}
::v-deep.under {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
::v-deep .el-switch {
  border-radius: 0px !important;
  height: 24px !important;
}
::v-deep .el-switch__core {
  width: 70px !important;
  height: 24px;
  border-radius: 3px;
  border: none;
}
::v-deep .el-switch__core::after {
  width: 50%;
  height: 24px;
  border-radius: 0px;
  top: 0px !important;
  right: 0px !important;
  left: 0px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
::v-deep .el-switch.is-checked .el-switch__core::after {
  margin-left: -35px;
  box-sizing: border-box;
  top: 0px !important;
  right: 0px !important;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
}
/*关闭时文字位置设置*/
::v-deep .el-switch__label--right {
  text-align: center;
  position: absolute;
  width: 40%;
  z-index: 1;
  right: 6px;
  margin-left: 0px;
  color: rgba(255, 255, 255, 1);
  span {
    font-size: 13px;
    box-sizing: border-box;
    color: #fff;
  }
}
/* 激活时另一个文字消失 */
::v-deep .el-switch__label.is-active {
  text-align: center;
  display: none;
}
/*开启时文字位置设置*/
::v-deep .el-switch__label--left {
  text-align: center;
  position: absolute;
  width: 40%;
  z-index: 1;
  left: 5px;
  margin-right: 0px;
  color: rgba(255, 255, 255, 1);
  span {
    font-size: 13px;
    box-sizing: border-box;
    color: #fff;
  }
}
.magicbox {
  margin: 0 auto;
  margin-top: 5px;
  height: 300px;
  overflow-y: scroll;
  .magic {
    height: 32px;
    padding: 2px 5px;
    line-height: 32px;
    &:hover {
      background-color: #409eff;
      transition: all ease 0.3s;
    }
  }
}
.orform ::v-deep {
  .el-form-item__content {
    width: 65%;
  }
}
.max ::v-deep {
  .el-form-item__content {
    .el-input {
      .el-input__inner {
        padding-right: 10px;
      }
    }
  }
}
.box1 {
  padding: 14px;
  font-size: 16px;
  text-align: center;
}
.box2 {
  color: red;
}
#main {
  width: 500px;
  height: 400px;
}
</style>
