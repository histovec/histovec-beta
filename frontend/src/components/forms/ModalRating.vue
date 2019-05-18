<template>
  <div v-if="show">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="close"
                  @click="show = false"
                >
                  <span aria-hidden="true">&times;</span>
                  <span class="sr-only">Fermer</span>
                </button>
                <h6 class="modal-title">
                  Votre évaluation
                </h6>
              </div>
              <form
                id="evaluation-form-with-recaptcha"
                role="form"
                @submit="send"
              >
                <div class="modal-body">
                  <label>
                    Comment évaluez-vous HistoVec :
                    <span
                      class="info_red"
                      title="Ce champ est requis."
                    >
                      *
                    </span>
                  </label>
                  <div class="rating position_left p-g-10">
                    <span
                      v-if="errors.includes('note')"
                      class="info_red txt-small-11"
                    >
                      {{ errorMessage['note'] }}
                      <br />
                    </span>
                    <span
                      v-for="n in ratings"
                      :key="n"
                    >
                      <a
                        :class="{'is-selected': ((note >= (ratings.length+1)-n) && note != null)}"
                        title="Give star"
                        @click="setNote((ratings.length+1)-n)"
                        @mouseover="starOver((ratings.length+1)-n)"
                        @mouseout="starOut"
                      >
                        ★
                      </a>
                    </span>
                  </div>
                  <p class="m-h-10">
                    <label>Vos commentaires ou suggestions :</label>
                    <textarea
                      id="message"
                      v-model="message"
                      name="message"
                      rows="2"
                      class="form-control"
                      maxlength="1000"
                    >
                    </textarea>
                  </p>
                  <br />
                  <div
                    class="form-group has-feedback"
                    :class="[{'has-error' : (errors.includes('email'))}]"
                  >
                    <p>
                      <label>
                        Acceptez-vous d'être recontacté pour nous donner votre retour d'expérience ?
                        <i>(L'adresse email ne servira que dans le cadre de cette étude)</i>
                      </label>
                      <span
                        v-if="errors.includes('email')"
                        class="info_red txt-small-11"
                      >
                        {{ errorMessage['email'] }}
                      </span>
                      <input
                        id="email"
                        v-model="email"
                        name="email"
                        class="form-control"
                        placeholder="name@example.com"
                      >
                    </p>
                  </div>
                </div>
                <div class="modal-footer">
                  <div class="row">
                    <div class="col-md-6 m-h-15 position_left">
                      <label>
                        <input
                          id="showModal"
                          v-model="notShow"
                          name="showModal"
                          type="checkbox"
                        >
                        Ne plus afficher
                      </label>
                    </div>
                    <div class="col-md-6">
                      <span
                        v-if="errors.includes('api')"
                        class="info_red txt-small-11"
                      >
                        {{ errorMessage['api'] }}
                        <br />
                      </span>
                      <button class="btn btn-animated btn-default m-h-05">
                        Envoyer
                        <i
                          class="fa"
                          :class="[{'fa-send-o' : (status === 'init')},
                                   {'fa-spin fa-spinner' : (status === 'posting')},
                                   {'fa-check' : (status === 'posted')},
                                   {'fa-exclamation-triangle' : (status === 'failed')}]"
                        >
                        </i>
                      </button>
                      <button
                        class="btn btn-animated btn-default"
                        @click="show = false"
                      >
                        Fermer
                        <i class="fa fa-close"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  props: {
    activate: Boolean,
    holder: Boolean
  },
  data () {
    return {
      errorMessage: {
        'email': 'L\'adresse email n\'est pas valide',
        'note': 'L\'évaluation est obligatoire',
        'api': 'Service indisponible, votre retour n\'a pas pu être pris en compte'
      },
      show: false,
      notShow: false,
      ratings: [1, 2, 3, 4, 5],
      tempValue: null,
      disabled: false,
      message: '',
      email: '',
      note: null,
      clicked: false,
      timerModalEval: 120000
    }
  },
  computed: {
    filteredMessage () {
      return this.normalize(this.message).replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ').replace(/\s+/,' ')
    },
    errors () {
      let errorList = []
      if (this.clicked && (!this.note)) {
        errorList.push('note')
      }
      if (this.clicked && this.email && !this.isEmailValid()) {
        errorList.push('email')
      }
      if (this.clicked && this.$store.state.api && this.$store.state.api.http.feedback && (this.$store.state.api.http.feedback !== 201)) {
        errorList.push('api')
      }
      return errorList
    },
    status () {
      if (this.clicked) {
        if (this.errors.length > 0) {
          return 'failed'
        } else if (this.$store.state.api && this.$store.state.api.fetching.feedback) {
          return 'posting'
        } else {
          return 'posted'
        }
      } else {
        return 'init'
      }
    }
  },
  watch: {
    activate (newVal) {
      if (newVal === true) {
        this.showModalEval()
      }
    }
  },
  created () {
    if (this.activate) {
      this.showModalEval()
    }
  },
  methods: {
    normalize (string) {
      try {
        return string.normalize('NFD')
      } catch (e) {
        return string.replace(/[\u0300-\u036f]*/g, '')
      }
    },
    async send (e) {
      e.preventDefault()
      this.$store.dispatch('initApiStatus', 'feedback')
      this.clicked = true
      if (this.notShow) {
          localStorage.setItem('evaluation', true, 1)
          this.show = false
          return
      }
      if (this.errors.length > 0) {
          setTimeout(() => this.clicked = false, 3000)
          return
      }
      if (this.note) {
        let data = {
          'message': this.filteredMessage, 
          'email': this.email, 
          'uid': localStorage.getItem('userId'), 
          'note': this.note,
          'date': new Date().toUTCString(), 
          'holder': this.holder
        }
        await this.$store.dispatch('sendFeedback', data)
        if (this.$store.state.api.http.feedback === 201) {
          localStorage.setItem('evaluation', true, 1)
          this.show = false
        } else {
          this.clicked = true
        }
      }
    },
    isEmailValid () {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return reg.test(this.email)
    },
    setNote (value) {
      if (!this.disabled) {
        this.tempValue = value
        this.note = value
      }
    },
    starOver (value) {
      if (!this.disabled) {
        this.tempValue = this.note
        this.note = value
      }
    },
    starOut () {
      if (!this.disabled) {
        this.note = this.tempValue
      }
    },
    showModalEval () {
      if (localStorage.getItem('evaluation') === 'false' || localStorage.getItem('evaluation') === null) {
        setTimeout(() => {
          this.show = true
          this.$store.dispatch('log', 'feedback')
        }, this.timerModalEval)
      }
    }
  }
}

</script>

