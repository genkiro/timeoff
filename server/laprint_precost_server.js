console.log('server file');

var users = [
    {name:"Employee Number 1",username: "employee1", roles:['manager'],password:'pikachu'},
    {name:"Christine Widjaja",username: "cwidjaja",roles:['admin'],password:'thinkexponential'}
];

_.each(users, function (user) {
    var id;

    if (!!Meteor.users.findOne({ "username" : user.username })) {
        // if there's the user, don't bother to create
        return;
    }

    id = Accounts.createUser({
        username: user.username,
        password: user.password,
        profile: { name: user.name }
    });

    if (user.roles.length > 0) {
        // Need _id of existing user record so this call must come
        // after `Accounts.createUser` or `Accounts.onCreate`
        Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
    }

});

// Some hack so we can see all emails & usernames
Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields: {"emails.address": 1, "username": 1}});
});

Meteor.users.allow({
    update: function () {
        return Roles.userIsInRole(Meteor.userId(), 'admin');
    }
});