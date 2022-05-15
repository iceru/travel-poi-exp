<template>
  <div class="listItems">
    <div v-for="item in services" :key="item.Id" class="item">
      <div class="itemImage">
        <img
          :src="item.Images ? item.Images[0].Url : '/images/no_image.png'"
          alt=""
        />
      </div>
      <div class="itemTitle">{{ item.Name }}</div>
      <div class="itemDesc">{{ item.LongDescription }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListItems",
  props: ["services"],
};
</script>

<style lang="scss" scoped>
.listItems {
  width: calc(30% + 1rem);
  overflow-y: scroll;
  position: absolute;
  height: 100%;
  padding: 1rem;
  top: 0;
  left: 0;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  box-shadow: 8px 0 20px rgba($color: #000000, $alpha: 0.15);
  gap: 12px;

  .item {
    margin-bottom: 1rem;
    font-size: 12px;
    .itemImage {
      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    .itemTitle {
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .itemDesc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
    }
  }
}
</style>
