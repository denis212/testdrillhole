<template>
  <div id="drillhole">
    <h2> Drill Holes </h2>
    <pulse-loader :loading="loading" class="mt-2"></pulse-loader>
    <table v-if="!loading" class="table table-hover">
      <thead class="thead-light">
      <tr>
        <th scope="col">Hole Name</th>
        <th scope="col">Latitude</th>
        <th scope="col">Longitude</th>
        <th scope="col">Dip</th>
        <th scope="col">Azimuth</th>
        <th scope="col">
          <!-- Action buttons -->
        </th>
      </tr>
      </thead>
      <tbody>
        <drill-hole-item
          v-for="drillHole in drillHoles"
          :holeImport="drillHole"
          :key="drillHole.id">
        </drill-hole-item>
        <drill-hole-item
          @save-new="addDrillHole($event)"
          :isnew="true">
        </drill-hole-item>
      </tbody>
    </table>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import DrillHoleItem from '@/components/DrillHoleItem';
import DrillHole from '@/models/drill-hole';

export default {
  name: 'DrillHole',
  data(){
    return{
      loading: true,
      drillHoles: []
    }
  },
  components: {
    PulseLoader,
    DrillHoleItem
  },
  methods: {
    addDrillHole(item){
      this.drillHoles.push(item);
    },
    loadDrillHoles(){
      this.drillHoles = [];
      this.$api.get("/drillholes")
        .then(response => {
          response.data.forEach(hole => {
            this.drillHoles.push(new DrillHole(hole));
          });

          this.loading = false;
        });
    }
  },
  mounted(){
    this.loadDrillHoles();
  }
}
</script>

<style scoped>
</style>
