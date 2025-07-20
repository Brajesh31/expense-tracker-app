<script setup>
import { ref, watch, computed, defineProps } from "vue";

const filter = ref("all");
const currentPage = ref(import.meta.env.VITE_CURRENT_PAGE || 1);
const perPage = ref(Number(import.meta.env.VITE_PER_PAGE || 5));

const props = defineProps({
    transactions: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const emit = defineEmits(["update:transactions"]);

//Filter transactions based on type
const filterTransactions = computed(() => {
    if (filter.value === "all") {
        return props.transactions;
    }

    return props.transactions.filter(
        (transaction) => transaction.type === filter.value
    );
});

//Recent page when filter changes
watch(filter, () => {
    currentPage.value = 1;
});

//Compute total number of pages
const totalPages = computed(() =>
    Math.ceil(filterTransactions.value.length / perPage.value)
);

//Compute the transections to display on the current page
const paginatedTransactions = computed(() => {
    const startIndex = (currentPage.value - 1) * perPage.value;
    return filterTransactions.value.slice(
        startIndex,
        startIndex + perPage.value
    );
});

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

//Delete transaction
const handleDeleteTransaction = (id) => {
    const confirm = window.confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirm) {
        return;
    }

    const updatedTransactions = props.transactions.filter(
        (transaction) => transaction.id !== id
    );
    emit("update:transactions", updatedTransactions);
};
</script>
<template>
    <div
        class="d-flex justify-content-between align-items-center my-3 text-white"
    >
        <div class="form-group mb-0">
            <div class="form-check form-check-inline">
                <input
                    type="radio"
                    name="type"
                    class="form-check-input"
                    id="filter-all"
                    value="all"
                    v-model="filter"
                />
                <label for="filter-all" class="form-check-label cursor-pointer"
                    >All</label
                >
            </div>

            <div class="form-check form-check-inline">
                <input
                    type="radio"
                    name="type"
                    class="form-check-input"
                    id="filter-income"
                    value="income"
                    v-model="filter"
                />
                <label
                    for="filter-income"
                    class="form-check-label cursor-pointer"
                    >Income</label
                >
            </div>

            <div class="form-check form-check-inline">
                <input
                    type="radio"
                    name="type"
                    class="form-check-input"
                    id="filter-expense"
                    value="expense"
                    v-model="filter"
                />
                <label
                    for="filter-expense"
                    class="form-check-label cursor-pointer"
                    >Expense</label
                >
            </div>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-dark table-striped table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="filterTransactions.length === 0">
                    <td colspan="4" class="text-center">
                        No transactions recorded yet.
                    </td>
                </tr>

                <tr
                    v-for="transaction in paginatedTransactions"
                    :key="transaction.id"
                >
                    <td>{{ transaction.title }}</td>
                    <td
                        :class="{
                            'text-success': transaction.type === 'income',
                            'text-danger': transaction.type === 'expense',
                            'fw-bold':
                                Number(transaction.amount) >= 500 &&
                                transaction.type === 'expense',
                        }"
                    >
                        ${{ transaction.amount }}
                    </td>
                    <td>{{ String(transaction.type).toUpperCase() }}</td>
                    <td>
                        <button
                            class="btn btn-danger"
                            @click="handleDeleteTransaction(transaction.id)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div
        class="d-flex justify-content-between align-items-center text-white my-3"
    >
        <button
            :disabled="currentPage == 1"
            @click="prevPage"
            class="btn btn-secondary"
        >
            Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
            :disabled="
                Number(currentPage) === Number(totalPages) ||
                Number(totalPages) === 0
            "
            @click="nextPage"
            class="btn btn-secondary"
        >
            Next
        </button>
    </div>
</template>
