<script setup>
import { computed } from "@vue/runtime-core";
import { useAppStore } from "../stores/app";
import { useFilterStore } from "../stores/filter";

const storeFilter = useFilterStore();
const storeApp = useAppStore();

const isOpen = computed(() => {
  return storeFilter.isOpen;
});
</script>

<template>
  <div class="overlay-bg" v-if="isOpen"></div>
  <div class="container-filter" v-if="isOpen">
    <div class="icon-close" @click="storeFilter.closeFilter()">
      <BIconXLg />
    </div>
    <div class="title">Filter</div>
    <div class="forms">
      <div class="form-groups w-100">
        <label class="form-label" for="">Keywords</label>
        <input class="form-input" v-model="formValues.keywords" type="text" />
      </div>
      <!-- <div class="form-groups w-100">
        <label class="form-label" for="">Locations</label>
        <input
          class="form-input"
          v-model="storeFilter.locationsName"
          type="text"
        />
      </div> -->
      <div class="form-groups checkbox w-100">
        <div class="form-checkbox">
          <input
            type="checkbox"
            id="poi"
            value="poi"
            checked
            v-model="formValues.categories"
          />
          <label for="poi">Point of Interest</label>
        </div>
        <div class="form-checkbox">
          <input
            type="checkbox"
            id="experiences"
            value="exp"
            checked
            v-model="formValues.categories"
          />
          <label for="experiences">Experiences</label>
        </div>
        <div class="form-checkbox">
          <input
            type="checkbox"
            id="accommodation"
            value="0"
            checked
            v-model="formValues.categories"
          />
          <label for="accommodation">Accommodation</label>
        </div>
        <div class="form-checkbox">
          <input
            type="checkbox"
            id="activity"
            value="1"
            checked
            v-model="formValues.categories"
          />
          <label for="activity">Activity</label>
        </div>

        <div class="form-checkbox">
          <input
            type="checkbox"
            id="restaurant"
            value="2"
            checked
            v-model="formValues.categories"
          />
          <label for="restaurant">Restaurant</label>
        </div>

        <div class="form-checkbox">
          <input
            type="checkbox"
            id="shopping"
            value="3"
            checked
            v-model="formValues.categories"
          />
          <label for="shopping">Shopping</label>
        </div>
      </div>
      <div class="form-groups">
        <label class="form-label" for="">Date</label>
        <input class="form-input" v-model="formValues.date" type="date" />
      </div>
      <div class="form-groups">
        <label class="form-label" for="">Number of Person</label>
        <input class="form-input" v-model="formValues.pax" type="number" />
      </div>
      <div class="form-groups">
        <label class="form-label" for="">Duration of Stay</label>
        <input class="form-input" v-model="formValues.duration" type="number" />
      </div>
      <div class="form-groups">
        <label class="form-label" for="">Duration of Stay</label>
        <select class="form-input" v-model="storeApp.sort" type="number">
          <option value="Name-Ascending">Name - Ascending</option>
          <option value="Name-Descending">Name - Descending</option>
          <option value="Price-Ascending">Price - Ascending</option>
          <option value="Price-Descending">Price - Descending</option>
        </select>
      </div>
      <div class="form-groups w-100">
        <label class="form-label" for="">Price Range</label>
        <input
          class="form-input w-50"
          v-model="formValues.minRange"
          type="number"
        />
        -
        <input
          class="form-input w-50"
          v-model="formValues.maxRange"
          type="number"
        />
      </div>
    </div>
    <button
      class="btn btn-default submit"
      v-on:click="storeFilter.setFilter(formValues)"
    >
      Submit
    </button>
  </div>
</template>

<script>
import { useAppStore } from "../stores/app";
export default {
  name: "Filter",
  setup() {
    const storeApp = useAppStore();
    const sortApp = computed(() => {
      return storeApp.sort;
    });
    return { sortApp };
  },
  data() {
    return {
      formValues: {
        keywords: "",
        date: new Date(),
        pax: 1,
        categories: ["poi", "exp", "0", "1", "2", "3"],
        duration: 1,
        minRange: 0,
        maxRange: 9999,
      },
    };
  },
};
</script>

<style lang="scss">
.container-filter {
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 32px rgba($color: #000000, $alpha: 0.4);

  .btn {
    padding: 0.75rem 1.25rem;
    outline: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color .2s ease;
    background-color: rgb(233, 233, 233);

    &:hover {
      background-color: rgb(206, 206, 206);
      transition: background-color .2s ease;
    }
  }

  @media screen and (max-width: 576px) {
    width: 80%;
  }

  .icon-close {
    text-align: end;
    cursor: pointer;
  }

  .title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 1rem;
  }

  .forms {
    display: flex;
    flex-wrap: wrap;

    .form-groups {
      margin-bottom: 1rem;
      width: 50%;

      &.w-100 {
        width: 100%;

        .form-input {
          width: calc(100% - 2rem);
        }
      }

      &.checkbox {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .form-checkbox {
      font-size: 13px;
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;

      input {
        margin-bottom: 0;
        margin-right: 6px;
      }
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 13px;
    }

    .form-input {
      border-radius: 0.25rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid gray;
      outline: none;
      font-size: 12px;
      width: calc(95% - 2rem);

      &.w-50 {
        width: calc(48% - 2rem) !important;
      }
    }

    select {
      width: 92% !important;
    }
  }
}
</style>
