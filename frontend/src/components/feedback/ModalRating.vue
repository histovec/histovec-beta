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
                  <span
                    v-if="status == 'failed' && errors.length == 0"
                    class="info_red txt-small-11"
                  >
                    * Veuillez renseigner les champs obligatoires
                    <br />
                  </span>
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
                    >
                    </textarea>
                  </p>
                  <br />
                  <div
                    class="form-group has-feedback"
                    :class="[{'has-error' : (errors.length > 0 && status !== 'init')}]"
                  >
                    <p>
                      <label>
                        Acceptez-vous d'être recontacté pour nous donner votre retour d'expérience ? 
                        <i>(L'adresse email ne servira que dans le cadre de cette étude)</i>
                      </label>
                      <span
                        v-if="errors.length > 0"
                        class="info_red txt-small-11"
                      >
                        {{ errors[0] }}
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
      show: false,
      errors: [],
      status: 'init',
      notShow: false,
      ratings: [1, 2, 3, 4, 5],
      tempValue: null,
      disabled: false,
      message: '',
      email: '',
      note: null,
      timerModalEval: 1200
    }
  },
  watch: {
    activate (newVal) {
      if (newVal === true) {
        this.showModalEval()
      }
    }
  },  
  methods: {
    send (e) {
      this.status = 'posting'
      if (this.note || this.notShow) {
        let data = {'message': this.message, 'email': this.email, 'uid': this.$cookie.get('userId'), 'note': this.note, 'date': new Date().toUTCString(), 'holder': this.holder}
        if (!this.note && this.notShow) {
          this.$cookie.set('evaluation', true, 1)
          this.status = 'posted'
          this.show = false
        } else {
          if (this.email && !this.isEmailValid()) {
            this.errors.push('L\'adresse email n\'est pas valide')
            this.status = 'failed'
          } else {
            this.$http.post(this.apiUrl + 'feedback/', data)
            .then(() => {
              this.status = 'posted'
              this.show = false
              this.$cookie.set('evaluation', true, 1)
            }, () => {
              this.status = 'failed'
            }
            )
          }
        }
      } else {
        this.status = 'failed'
      }
      e.preventDefault()
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
      if (this.$cookie.get('evaluation') === 'false' || this.$cookie.get('evaluation') === null) {
        setTimeout(() => {
          this.show = true
          this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + 'feedback').then(() => {}, () => {})
        }, this.timerModalEval)
      }
    }
  }
}

</script>

