<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <span class="icon">
                <i class="fa fa-keyboard-o" aria-hidden="true"></i>
              </span>
              {{ localization.editor.shortcuts.title[lang] }}
            </div>

            <div class="card-header-icon">
              <button class="delete" @click="$emit('close')"></button>
            </div>
          </div>

          <div class="card-content">
            <div class="level">
              <h5 class="subtitle" v-html="localization.editor.shortcuts.general[lang]"></h5>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">S</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.save[lang]"></div>
              </div>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">F</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.find[lang]"></div>
              </div>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">G</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.findNext[lang]"></div>
              </div>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Shift</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">G</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.findPrevious[lang]"></div>
              </div>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Shift</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">F</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.replace[lang]"></div>
              </div>
            </div>

            <div class="box">
              <div class="columns level">
                <div class="column is-half has-text-centered">
                  <span class="tag is-medium">Shift</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">R</span>
                </div>
                <div class="column is-half" v-html="localization.editor.shortcuts.replaceAll[lang]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <button class="modal-close is-large" @click="$emit('close')"></button>
  </div>
</template>
