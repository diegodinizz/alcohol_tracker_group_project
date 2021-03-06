const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');
const FormView = require('../views/form_view.js');

const Booze = function (url) {
  this.url = url;
  this.request = new RequestHelper(this.url)
  this.allData = []
};

Booze.prototype.bindEvents = function() {

  PubSub.subscribe('BoozeFormView:booze-submitted', (event) => {
    this.postBooze(event.detail)
  })

  PubSub.subscribe('DrinkView:delete_clicked', (event) => {
    this.deleteBooze(event.detail)
  })

  PubSub.subscribe('DrinkView:update_clicked', (event) => {
    this.findOne(event.detail)
  })

  PubSub.subscribe('FormView:update-submitted', (event) => {
    this.update(event.detail.body, event.detail.id);
  })

  PubSub.subscribe('Settings:data-loaded', (event) => {
    this.getData()
  })
};

Booze.prototype.getData = function () {
  this.request.get()
  .then((boozeDetails) => {
    PubSub.publish('Booze:data-loaded', boozeDetails)
    this.allData = boozeDetails;
  })
  .catch(console.error)
};

Booze.prototype.postBooze = function (boozeDetail) {
  this.request.post(boozeDetail)
  .then((boozeDetails) => {
    PubSub.publish('Booze:data-loaded', boozeDetails)
  })
};

Booze.prototype.findOne = function (drinkID) {
  this.request.find(drinkID)
  .then((drink) => {
    PubSub.publish('Booze:found-drink-ready', drink)
  })
};

Booze.prototype.update = function (body, drinkID) {
  this.request.put(body, drinkID)
  .then((drinks) => {
    PubSub.publish('Booze:data-loaded', drinks)
  })
};

Booze.prototype.deleteBooze = function (drinkID) {
  this.request.delete(drinkID)
  .then((drink)=>{
    PubSub.publish('Booze:data-loaded', drink)
    console.log('Booze:data-loaded::', drink)
  })
};

module.exports = Booze;
