import Ember from 'ember';
import ajax from 'ember-fetch/ajax';

export default Ember.Route.extend({
    flashMessages: Ember.inject.service(),

    beforeModel() {
        if (this.session.get('isLoggedIn') &&
            this.session.get('currentUser') === null) {
            ajax('/me').then((response) => {
                let user = this.store.push(this.store.normalize('user', response.user));
                user.set('api_token', response.api_token);
                this.session.set('currentUser', user);
            }).catch(() => this.session.logoutUser()).finally(() => {
                window.currentUserDetected = true;
                Ember.$(window).trigger('currentUserDetected');
            });
        } else {
            window.currentUserDetected = true;
        }
    },

    actions: {
        didTransition() {
            this.get('flashMessages').stepFlash();
        },
    },
});
