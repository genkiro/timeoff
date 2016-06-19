Meteor.methods({
    pikachu: function(a, b) {
        console.log('a: ' + a);
        console.log('b: ' +b);
        return 'pikachu';
    },
    rezetPassword: function(userId, newPassword) {
        Accounts.setPassword(userId, newPassword);
    }
});