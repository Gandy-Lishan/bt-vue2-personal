<template>
    <div class="filter-section">
      <strong>FILTER BY SOURCE</strong>
      <label v-for="source in sources" :key="source.value">
        <input
          type="checkbox"
          :value="source.value"
          :checked="value.includes(source.value)"
          @change="toggleSource(source.value)"
        />
        {{ source.label }}
      </label>
    </div>
  </template>
  
  <script>
  export default {
    name: "SourceFilter",
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        sources: [
          { label: "Charts", value: "charts" },
          { label: "Reports", value: "reports" },
          { label: "Blogs", value: "blogs" },
        ],
      };
    },
    methods: {
      toggleSource(source) {
        const newVal = this.value.includes(source)
          ? this.value.filter((v) => v !== source)
          : [...this.value, source];
        this.$emit("input", newVal); // 关键！
      },
    },
  };
  </script>
  
  <style scoped>
  .filter-section {
    display: flex;
    flex-direction: row;
    font-size: 0.9rem;
    margin: 2rem;
    column-gap: 15px;
  }
  </style>
  