<template>
    <div>
        <div class="container">
            <el-row>
                <el-select v-model="value" filterable placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-row>
                        <div id="myChart" :style="{width: '100%', height: '50%'}"></div>
                    </el-row>
                    <el-row>
                        <div class="table"></div>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <div class="map"></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-row>
                        <div id="myChart" :style="{width: '100%', height: '50%'}"></div>
                    </el-row>
                    <el-row>
                        <div class="table"></div>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <div class="map"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    name: 'monitor',
    data() {
        return {
            options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
        };
    },

    computed: {
        
    },
    mounted() {
        this.initChart()
    },
    methods: {
        initChart(){
            let myChart = this.$echarts.init(document.getElementById('myChart'));
            myChart.setOption({
                // title : {
                //     //text: '某站点用户访问来源',
                //     //subtext: '纯属虚构',
                //     //x:'center'
                // },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                //legend: {
                    //orient: 'vertical',
                    //left: 'left',
                    //data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                //},
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    }
};
</script>


<style scoped>
.map{
    height:200px;
    width:100%;
    background:red
}
.table{
    height:100%;
    width:100%;
    background:red

}
</style>
