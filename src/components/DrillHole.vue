<template>
  <div id="drillhole">
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
      </tbody>
    </table>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import DrillHoleItem from '@/components/DrillHoleItem';
import DrillHole from '@/models/drill-hole';

export default {
  name: 'HelloWorld',
  data(){
    return{
      loading: true,
      drillHoles: [
        new DrillHole({
          id: "Hole 1",
          lat: 37.15,
          lng: -53.3,
          dip: 0.5,
          azimuth: 2
        }),
        new DrillHole({
          id: "Hole 2",
          lat: 66.11,
          lng: 23.5,
          dip: -0.1,
          azimuth: 0.5
        })]
    }
  },
  components: {
    PulseLoader,
    DrillHoleItem
  },
  created(){
    setTimeout(()=>{
      this.loading = false;
    }, 1000);
  }
}
</script>

<style scoped>
</style>
