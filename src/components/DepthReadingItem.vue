<template>
  <tr>
    <td>
      <input
        type="number"
        :readonly="!isnew"
        min="0"
        class="form-control"
        v-model.number="depthReading.depth">
    </td>
    <td>
      <input
        type="number"
        :readonly="!isnew"
        min="0"
        max="90"
        step="0.01"
        class="form-control"
        v-model.number="depthReading.dip">
    </td>
    <td>
      <input
        type="number"
        :readonly="!isnew"
        min="0"
        max="360"
        step="0.01"
        class="form-control"
        v-model.number="depthReading.azimuth">
    </td>
    <td>
      <input
        type="checkbox"
        :disabled="mode==='view' || isnew"
        class="form-control"
        v-model.number="depthReading.trustworthy">
    </td>
    <td class="text-right">
      <!-- Edit -->
      <button
        v-if="mode === 'view'"
        type="button"
        class="btn btn-sm btn-secondary"
        @click="mode = 'edit'"
        key="edit-button">
        <i class="fas fa-pen"></i>
      </button>

      <!-- Save -->
      <button
        v-if="mode === 'edit'"
        type="button"
        class="btn btn-sm btn-success"
        @click="saveItem"
        key="save-button">
        <i class="fas fa-check"></i>
      </button>

      <!-- Cancel New -->
      <button
        v-if="isnew"
        type="button"
        class="btn btn-sm btn-danger"
        @click="cancelNew">
        <i class="fas fa-times-circle"></i>
      </button>

      <!-- Cancel Existing -->
      <button
        v-if="!isnew && mode==='edit'"
        type="button"
        class="btn btn-sm btn-danger"
        @click="cancelChanges"
        key="cancel-existing-button">
        <i class="fas fa-times-circle"></i>
      </button>
    </td>
  </tr>
</template>

<script>
  import DepthReading from '@/models/depth-reading';

  export default {
    name: 'depth-reading-item',
    data(){
      return {
        mode: 'view',
        depthReading: new DepthReading({})
      }
    },
    props: [
      'drImport',
      'isnew',
      'hole_id'
    ],
    methods: {
      reset(){
        if(this.drImport){
          this.depthReading = new DepthReading(this.drImport);
        }
        else if(this.isnew){
          this.mode = 'edit';
          this.depthReading = new DepthReading({ hole_id: this.hole_id});
        }
      },
      cancelNew() {
        this.reset();
      },
      cancelChanges() {
        if(this.drImport){
          this.depthReading = new DepthReading(this.drImport);
        }
        this.mode = 'view';
      },
      saveItem(){
        if(this.isnew){
          this.$api.post("/depthreadings", this.depthReading)
            .then(item => {
              this.$emit("save-new", item.data);
              this.reset();
            });
        }
        else{
          this.$api.put("/depthreadings", this.depthReading)
            .then(() => {
              this.mode = 'view';
            });
        }
      }
    },
    computed: {
    },
    created() {
      this.reset();
    },
  }
</script>

<style lang="scss" scoped>
</style>
