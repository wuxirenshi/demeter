<template>
    <section class="chart-container">
        <div class="block">
            <el-date-picker :change="handleGet(pickValue)"
                            v-model="pickValue"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions2">
            </el-date-picker>
        </div>
        <el-row>
            <el-col :span="24">
                <div id="chartLine" style="min-width: 800px; width:100%; height:300px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {getPassRate} from '../../api/api';

    export default {
        data() {
            return {
                chartLine: null,
                name: 100,
                pickValue: '',
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },

        methods: {
            handleGet(pick_value){
                if (pick_value && pick_value[0] && pick_value[1]) {
                    this.drawLineChart(pick_value[0].getTime(), pick_value[1].getTime());
                }
            },
            drawLineChart(start_date, end_date) {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.set_option(this.chartLine, start_date, end_date);
            },
            set_option(echart, start_date, end_date){
                let para = {start_date: start_date, end_date: end_date};
                getPassRate(para).then(res => {
                    let {code, msg, date_time} = res.data;
                    console.log(Object.keys(msg))
                    let option = {
                        title: {
                            text: '订单组回归通过率',
                            left: '50%'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
//                            width: 800,
                            data: this.get_round_rect(msg),
                            orient: 'vertical',
                            left: 0,
                            bottom: '5%',
                            itemGap: 10,
                            tooltip: {
                                show: true
                            }
                        },
                        grid: {
                            left: '15%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            data: date_time,
//                            min: 'dataMin',
                        },
                        yAxis: {
                            type: 'value',
                            min: function (value) {
                                return parseInt(value.min) - 20;
                            },
                            axisLabel: {
                                formatter: '{value} %'
                            },
                        },
                        series: this.get_cov_by_name(msg)
                    };
                    echart.setOption(option);
                    this.update_legend(echart);
                })
            },

            showWeeklyData(param){

            },

            update_legend(echart){
                echart.on('legendselectchanged', function (params) {
                    let option = this.getOption();
                    let select_key = Object.keys(params.selected);
                    if (!params.selected[params.name]) {
                        select_key.map(res => {
                            option.legend[0].selected[res] = !params.selected[res];
                        });
                        console.log(select_key);
                    } else {
                        select_key.map(res => {
                            option.legend[0].selected[res] = false;
                        });
                        option.legend[0].selected[params.name] = true;
                    }
                    this.setOption(option)
                });
            },

            get_round_rect(msg){
                let key = Object.keys(msg);
                return key.map(res => ({name: res, icon: 'roundRect'}))
            },

            get_cov_by_name(msg){
                let key = Object.keys(msg);
                return key.map(res => ({
                    name: res,
                    type: 'line',
                    connectNulls: true,
                    data: msg[res],
                }))
            },

            drawCharts() {
                this.drawLineChart();
            },
        },

        mounted: function () {
            this.drawCharts()
        },
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    .el-col {
        padding: 30px 20px;
    }
</style>
