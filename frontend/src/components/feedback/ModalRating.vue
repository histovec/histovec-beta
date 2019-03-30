<template>
  <div v-if="show">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" @click="show = false">
                  <span aria-hidden="true">&times;</span>
                  <span class="sr-only">Fermer</span>
                </button>
                <h6 class="modal-title">Votre évaluation</h6>
              </div>
              <form @submit="send" id="evaluation-form-with-recaptcha"  role="form">
                <div class="modal-body">
                  <span class="info_red txt-small-11" v-if="status == 'failed' && errors.length == 0">* Veuillez renseigner les champs obligatoires<br/></span>
                  <label>Comment évaluez-vous HistoVec :  <span class="info_red" title="Ce champ est requis.">*</span></label>
                  <div class="rating position_left p-g-10">
                    <template v-for="n in ratings" >
                      <a v-on:click="setNote((ratings.length+1)-n)"
                         v-on:mouseover="starOver((ratings.length+1)-n)"
                         v-on:mouseout="starOut"
                         v-bind:class="{'is-selected': ((note >= (ratings.length+1)-n) && note != null)}"
                         title="Give star"
                         v-model="note">★</a>
                    </template>
                  </div>
                  <p class="m-h-10">
                    <label>Vos commentaires ou suggestions :</label>
                    <textarea class="form-control" id="message" name="message" rows="2" v-model="message"></textarea>
                  </p>
                  <br />
                  <div class="form-group has-feedback" :class="[{'has-error' : (errors.length > 0 && status !== 'init')}]">
                    <p>
                    <label>Acceptez-vous d'être recontacté pour nous donner votre retour d'expérience ? <i>(L'adresse email ne servira que dans le cadre de cette étude)</i></label>
                    <span class="info_red txt-small-11" v-if="errors.length > 0">{{ errors[0] }}</span>
                    <input class="form-control" id="email" name="email" placeholder="name@example.com" v-model="email">
                    </p>
                  </div>
                </div>
                <div class="modal-footer">
                  <div class="row">
                    <div class="col-md-6 m-h-15 position_left">
                      <label>
                      <input type="checkbox" id="showModal" name="showModal" v-model="notShow">Ne plus afficher</label>
                    </div>
                    <div class="col-md-6">
                      <button class="btn btn-animated btn-default m-h-05">Envoyer
                        <i class="fa" :class="[{'fa-send-o' : (status === 'init')},
                                           {'fa-spin fa-spinner' : (status === 'posting')},
                                           {'fa-check' : (status === 'posted')},
                                           {'fa-exclamation-triangle' : (status === 'failed')}]"></i>
                      </button>
                      <button class="btn btn-animated btn-default" @click="show = false">Fermer <i class="fa fa-close"></i></button>
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
      timerModalEval: 120000
    }
  },
  methods: {
    send (e) {
      this.status = 'posting'
      if (this.note || this.notShow) {
        let data = {'message': this.message, 'email': this.email, 'uid': this.$cookie.get('userId'), 'note': this.note, 'date': new Date().toUTCString()}
        if (!this.note && this.notShow) {
          this.$cookie.set('evaluation', true, 1)
          this.status = 'posted'
          this.modalEval = false
        } else {
          if (this.email && !this.isEmailValid()) {
            this.errors.push('L\'adresse email n\'est pas valide')
            this.status = 'failed'
          } else {
            this.$http.post(this.apiUrl + 'feedback/', data)
            .then(response => {
              this.status = 'posted'
              this.modalEval = false
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
          this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + 'feedback').then(response => {}, () => {})
        }, this.timerModalEval)
      }
    }
  },
  watch: {
    activate (newVal, oldVal) {
      if (newVal === true) {
        this.showModalEval()
      }
    }
  }
}

</script>

