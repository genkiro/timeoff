PersonnelInfo = new Mongo.Collection('personnelInfo');

PersonnelInfo.allow({
    insert: function (userId, doc) {
        // Logged in & is admin
        return userId && Roles.userIsInRole(userId, 'admin');
    },
    update: function (userId, doc, fields, modifier) {
        return userId && Roles.userIsInRole(userId, 'admin');
    },
    remove: function (userId, doc) {
        return userId && Roles.userIsInRole(userId, 'admin');
    }
});
