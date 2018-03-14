<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('agents')">
        <div class="card-panel-icon-wrapper icon-people">
          <icon name="form" scale="5"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">代办任务</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="agents_number" :duration="2000"></count-to>
          <label class="card-panel-num">个</label>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('settled')">
        <div class="card-panel-icon-wrapper icon-message">
          <icon name="clipboard" scale="5"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">完成任务</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="settled_number" :duration="2000"></count-to>
          <label class="card-panel-num">个</label>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('records')">
        <div class="card-panel-icon-wrapper icon-money">
          <icon name="excel" scale="5"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">提测记录</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="records_number" :duration="2000"></count-to>
          <label class="card-panel-num">个</label>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('tasks')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <icon name="component" scale="5"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">创建</div>
          <div class="card-panel-text">任务</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    import CountTo from 'vue-count-to'
    import ElRadioGroup from "../../../../node_modules/element-ui/packages/radio/src/radio-group";

    export default {
        components: {
            ElRadioGroup, CountTo
        },
        props: {
            agents_number: Number,
            settled_number: Number,
            records_number: Number,
        },
        methods: {
            handleSetLineChartData(type) {
                this.$emit('handleSetLineChartData', type)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 15px;
    }
    .card-panel {
      height: 90px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 8px 0 0 8px;
        padding: 12px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 5px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
