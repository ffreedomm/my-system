<template>
    <div class="container">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
</template>

<script>
import { } from '@/api/index';
export default {
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {

    },
     handleNodeClick(data) {
        console.log('----------e---e-e-', data);
      }
  }
};
</script>

<style scoped>
</style>
