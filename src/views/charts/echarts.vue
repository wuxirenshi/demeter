<template>
    <section class="chart-container">
        <div class="block">
            <el-date-picker :change="handleGet(pickValue)"
                            v-model="pickValue"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions2"
                            value-format="timestamp">
            </el-date-picker>
        </div>
        <el-row>
            <el-col :span="24">
                <div id="chartLinePython" style="min-width: 800px; width:100%; height:250px;"></div>
            </el-col>
            <el-col :span="24">
                <div id="chartLineJava" style="min-width: 800px; width:100%; height:250px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {getUnitProjectList, getCoverageList} from '../../api/api';

    export default {
        data() {
            return {
                chartPythonLine: null,
                chartJavaLine: null,
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
                if (pick_value) {
                    this.drawLinePythonChart(pick_value[0], pick_value[1]);
                    this.drawLineJavaChart(pick_value[0], pick_value[1])
                }
            },
            drawLinePythonChart(start_date, end_date) {
                this.chartPythonLine = echarts.init(document.getElementById('chartLinePython'));
                this.set_option(this.chartPythonLine, 'python', start_date, end_date);
            },
            drawLineJavaChart(start_date, end_date){
                this.chartJavaLine = echarts.init(document.getElementById('chartLineJava'));
                this.set_option(this.chartJavaLine, 'java', start_date, end_date);
            },
            set_option(echart, program, start_date, end_date){
                let para = {program: program, start_date: start_date, end_date: end_date};
                getUnitProjectList(para).then(res => {
                    let {code, msg, date_time} = res.data;
                    let option = {
                        title: {
                            text: program
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            width: 800,
                            data: Object.keys(msg)
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            data: date_time
                        },
                        yAxis: {
                            type: 'value',
                            min: 'dataMin',
                            axisLabel: {
                                formatter: '{value} %'
                            },
                        },
                        series: this.get_cov_by_name(msg)
                    };
                    echart.setOption(option);
                    this.update_legend(echart);
                    echart.on('click', function (params) {
                        window.open('http://ut.elenet.me/unittest/coverage/'+ params.seriesName);
                    })
                });
            },
            update_legend(echart){
                echart.on('legendselectchanged', function (params) {
                    let option = this.getOption();
                    let select_key = Object.keys(params.selected);
                    if (!params.selected[params.name]) {
                        select_key.map(res => {
                            option.legend[0].selected[res] = !params.selected[res];
                        });
                    } else {
                        select_key.map(res => {
                            console.log(res);
                            option.legend[0].selected[res] = false;
                        });
                        option.legend[0].selected[params.name] = true;
                    }
                    this.setOption(option)
                });
            },
            drawCharts() {
                this.drawLinePythonChart();
                this.drawLineJavaChart();
            },
            get_cov_by_name(msg){
                let key = Object.keys(msg);
                return key.map(res => ({
                    name: res,
                    type: 'line',
                    connectNulls: true,
                    data: msg[res]
                }))
            }
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
