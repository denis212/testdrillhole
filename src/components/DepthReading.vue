<template>
  <div id="depthreading">
    <h2 v-text="headerTitle"></h2>
    <pulse-loader :loading="loading" class="mt-2"></pulse-loader>

    <table v-if="!loading" class="table table-hover">
      <thead class="thead-light">
      <tr>
        <th scope="col">Depth</th>
        <th scope="col">Dip</th>
        <th scope="col">Azimuth</th>
        <th scope="col">Trustworthy?</th>
        <th scope="col">
          <!-- Action buttons -->
        </th>
      </tr>
      </thead>
      <tbody>
      <depth-reading-item
        @save-new="addDepthReading($event)"
        :hole_id="$attrs.hole_id"
        :isnew="true">
      </depth-reading-item>
      <depth-reading-item
        v-for="depthReading in depthReadings"
        :drImport="depthReading"
        :hole_id="$attrs.hole_id"
        :key="depthReading.id">
      </depth-reading-item>
      </tbody>
    </table>
  </div>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
  import DepthReadingItem from '@/components/DepthReadingItem';
  import DepthReading from '@/models/depth-reading';

  export default {
    name: 'DepthReading',
    data(){
      return{
        loading: true,
        depthReadings: [],
        drillHole: ''
      }
    },
    components: {
      PulseLoader,
      DepthReadingItem
    },
    methods: {
      addDepthReading(item){
        this.depthReadings.unshift(item);
      },
      loadDrillHole(){
        this.$api.get("/drillholes/"+this.$attrs.hole_id)
          .then(response => {
            this.drillHole = response.data;
          });
      },
      loadDepthReadings(){
        this.depthReadings = [];
        this.$api.get("/depthreadings/"+this.$attrs.hole_id)
          .then(response => {
            response.data.forEach(dr => {
              this.depthReadings.push(new DepthReading(dr));
            });

            this.loading = false;
          });
      }
    },
    computed: {
      headerTitle(){
        return "Depth Readings: "+this.drillHole.name;
      }
    },
    mounted(){
      this.loadDrillHole();
      this.loadDepthReadings();
    }
  }
</script>

<style scoped>
</style>
