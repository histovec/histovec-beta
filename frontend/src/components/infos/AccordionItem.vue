<template>
  <li :id="id">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a
          :href="`#${id}`"
          class="clickable"
          :class="[{ collapsed: !active }]"
          @click="$emit('click', id)"
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
      <div class="panel-body">
        <slot></slot>
      </div>
    </div>
  </li>
</template>

<script>
import slugify from 'slugify'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: false,
      default: slugify(this.title),
    },
    body: {
      type: String,
      default: '',
    },
    active: Boolean,
    icon: {
      type: String,
      required: false,
      default: 'file-text-o',
    },
  },

  data() {
    return {
      iconClass: `fa-${this.icon || 'file-text-o'}`,
    }
  },
}
</script>
