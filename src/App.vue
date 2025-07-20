<script setup>
import AddTransaction from "@/components/AddTransaction.vue";
import { ref, onMounted } from "vue";
import TransactionList from "@/components/TransactionList.vue";

const transactions = ref([]);

const handleUpdateTransactions = (updatedTransactions) => {
    transactions.value = updatedTransactions;
    localStorage.setItem("transactions", JSON.stringify(transactions.value));
};

onMounted(() => {
    const transactionsFromLocalStorage = localStorage.getItem("transactions");
    if (transactionsFromLocalStorage) {
        transactions.value = JSON.parse(transactionsFromLocalStorage);
    }
});
</script>

<template>
    <div
        class="container-fluid bg-dark vh-100 vw-100 align-items-center justify-content-center d-flex"
    >
        <div class="container w-50">
            <AddTransaction
                :transactions="transactions"
                @update:transactions="handleUpdateTransactions"
            />
            <TransactionList
                @update:transactions="handleUpdateTransactions"
                :transactions="transactions"
            />
        </div>
    </div>
</template>
