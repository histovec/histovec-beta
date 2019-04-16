<template>
  <li
    :id="id"
    class="panel panel-default"
  >
    <div class="panel-heading">
      <h4 class="panel-title">
        <a
          :href="`#${id}`"
          class="clickable"
          :class="[{ collapsed: !active }]"
          @click.prevent="$emit('click', id)"
        >
          <i
            class="fa pr-10"
            :class="[iconClass]"
          ></i>
          {{ title }}
        </a>
      </h4>
    </div>
    <div
      class="panel-collapse collapse"
      :class="{ in: active }"
    >
      <!-- eslint-disable-next-line vue/max-attributes-per-line vue/no-v-html -->
      <div class="panel-body" v-html="body">
        <slot></slot>
      </div>
    </div>
  </li>
</template>

<script>
import slugify from '@sindresorhus/slugify'

export default {
  props: {
    active: Boolean,
    body: {
      type: String,
      default: '',
      required: false,
    },
    icon: {
      type: String,
      required: false,
      default: 'file-text-o',
    },
    title: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      iconClass: `fa-${this.icon || 'file-text-o'}`,
      id: slugify(this.title),
    }
  },
}
</script>

<style lang="scss">
.indented {
  margin-left: 40px;
}
</style>
