<script lang="ts" setup="">
import { openManageScript } from '@/core/navigation/openManageScript';
import NewScriptModal from '@/core/new-script-modal/NewScriptModal.vue';
import { ref } from 'vue';

const emit = defineEmits<{
	(e: 'create', name: string, pattern: string): void;
}>();

const newScriptModalVisible = ref(false);

const openNewScriptModal = () => {
	newScriptModalVisible.value = true;
}

const createScript = (name: string, pattern: string) => {
	emit('create', name, pattern);
}

</script>

<template>
	<v-container class="h-100">
		<v-spacer />
		<v-row>
			<v-spacer />
			<v-col>
				<v-card>
					<v-card-title>
						No applicable script
					</v-card-title>
					<v-card-text>
						<p>
							There is no applicable script for this page.
						</p>
						<p>
							You can create a new script for this page by clicking the button below.
						</p>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="openManageScript">
							Manage scripts
						</v-btn>
						<v-btn color="primary" @click="openNewScriptModal">
							New script
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-spacer />
		</v-row>
		<v-spacer />
	</v-container>
	<NewScriptModal :visible="newScriptModalVisible"
					@update:visible="newScriptModalVisible = $event"
					@create="createScript"
	/>
</template>

<style scoped>

</style>