<template>
	<tr>
		<td>
			<input
				type="text"
				maxlength="255"
				:readonly="mode==='view'"
				class="form-control"
				v-model="drillHole.id">
		</td>
		<td>
			<input
				type="number"
				:readonly="mode==='view'"
				min="-90"
				max="90"
				step="0.01"
				class="form-control"
				v-model.number="drillHole.lat">
		</td>
		<td>
			<input
				type="number"
				:readonly="mode==='view'"
				min="-90"
				max="90"
				step="0.01"
				class="form-control"
				v-model.number="drillHole.lng">
		</td>
		<td>
			<input
				type="number"
				:readonly="mode==='view'"
				min="0"
				max="90"
				step="0.01"
				class="form-control"
				v-model.number="drillHole.dip">
		</td>
		<td>
			<input
				type="number"
				:readonly="mode==='view'"
				min="0"
				max="360"
				step="0.01"
				class="form-control"
				v-model.number="drillHole.azimuth">
		</td>
		<td class="text-right">
			<!-- Edit -->
			<button
				v-if="mode === 'view'"
				type="button"
				class="btn btn-sm btn-primary"
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

			<!-- Delete -->
			<button
				v-if="!isnew && mode==='view'"
				type="button"
				class="btn btn-sm btn-danger"
				@click="deleteItem"
				key="delete-button">
				<i class="fas fa-trash-alt"></i>
			</button>
		</td>
	</tr>
</template>

<script>
	import DrillHole from '@/models/drill-hole';
	import $ from 'jquery';

  export default {
    name: 'drill-hole-item',
    data(){
      return {
        mode: 'view',
        isnew: false,
				drillHole: new DrillHole({})
      }
    },
    props: [
      'holeImport'
    ],
    methods: {
      cancelNew() {
        this.$emit('cancel-new-lockdown', this.id);
      },
      cancelChanges() {
        this.drillHole = new DrillHole(this.holeImport);
        this.mode = 'view';
      },
      saveItem(){

      },
      deleteItem(){
        $('#delete'+this.id).modal('hide');
        this.$emit('delete-lockdown', this.id);
      }
    },
    computed: {
    },
    created() {
      if(this.holeImport){
        this.drillHole = new DrillHole(this.holeImport);
			}
    },
  }
</script>

<style lang="scss" scoped>
</style>
