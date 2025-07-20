<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const formData = ref({
    title: "",
    amount: 0,
    type: "expense",
});

const props = defineProps({
    transactions: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const emit = defineEmits(["update:transactions"]);

const addTransaction = () => {
    if (!formData.value.title) {
        toast.error("Please fill the title field");
        return;
    }

    if (formData.value.amount <= 0) {
        toast.error("Please fill the amount field with a positive amount");
        return;
    }

    if (formData.value.type !== "expense" && formData.value.type !== "income") {
        toast.error("Type must be either expense or income");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        title: formData.value.title,
        amount: formData.value.amount,
        type: String(formData.value.type).trim().toLowerCase(),
    };

    const updateTransactions = [...props.transactions, transaction];
    emit("update:transactions", updateTransactions);

    formData.value.title = "";
    formData.value.amount = 0;
    formData.value.type = "expense";
};
</script>

<template>
    <form @submit.prevent="addTransaction">
        <div class="row mb-2">
            <div class="col-3">
                <input
                    v-model="formData.title"
                    type="text"
                    class="form-control"
                    placeholder="Title"
                />
            </div>

            <div class="col-3">
                <input
                    v-model="formData.amount"
                    type="number"
                    class="form-control"
                    placeholder="Amount"
                />
            </div>

            <div class="col-3">
                <select v-model="formData.type" class="form-select">
                    <option value="">Type...</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            <div class="col-3">
                <button class="btn btn-primary w-100">Add</button>
            </div>
        </div>
    </form>
</template>
