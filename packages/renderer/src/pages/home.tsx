import AddExperimentForm from '@/components/AddExperimentForm';
import ConfigModal from '@/components/ConfigModal';
import ExperimentCard from '@/components/experimentCard';
import Modal from '@/components/modal';
import { createExperiment, loadExperiments } from '@/logic/experiment';
import { ExperimentDto } from 'packages/main/logic/experiment.d';
import { For, Suspense, createResource, createSignal } from 'solid-js';

export default function Home() {
  const [experiments, { mutate }] = createResource(loadExperiments);

  const [modal, setModal] = createSignal(false);
  const [configModal, setConfigModal] = createSignal(false);

  async function addData(dto: ExperimentDto) {
    const experiment = await createExperiment(dto);
    setModal(false);
    mutate(experiment);
  }

  return (
    <section class="bg-gray-100 text-gray-700 p-8 min-h-full">
      <div class="flex justify-between items-center space-x-2">
        <h1 class="text-2xl font-bold mb-4">Эксперименты</h1>
        <div class='flex gap-4'>
          <button
            class="border rounded-lg px-2 border-gray-300 bg-white hover:bg-gray-100"
            onClick={() => setConfigModal(true)}
          > Конфиг
          </button>
          <button
            class="border rounded-lg px-2 border-gray-300 bg-white hover:bg-gray-100"
            onClick={() => setModal(true)}
          > Добавить
          </button>
        </div>

      </div>

      <Modal title='Добавление эксперимента' modal={modal} setModal={setModal}>
        <div>
          <AddExperimentForm addExperiment={addData} />
        </div>
      </Modal>
      <Modal title='Конфиг' modal={configModal} setModal={setConfigModal}>
        <div>
          <ConfigModal closeModal={() => setConfigModal(false)} />
        </div>
      </Modal>


      <Suspense fallback={<div>Загрузка</div>}>
        <div class='flex flex-col gap-4'>
          <For each={experiments()} >
            {(experiment) =>
              <ExperimentCard experiment={experiment} />
            }
          </For>
        </div>
      </Suspense>
    </section >
  );
}
