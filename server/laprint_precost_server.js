console.log('server file');

var users = [
    {name:"Employee Number 1",email:"employee@fake.com",roles:['manager'],password:'pikachu'},
    {name:"Christine Widjaja",email:"christine.yulianti.widjaja@gmail.com",roles:['admin'],password:'thinkexponential'}
];

_.each(users, function (user) {
    var id;

    if (!!Meteor.users.findOne({ "emails.address" : user.email })) {
        // if there's the user, don't bother to create
        return;
    }

    id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: { name: user.name }
    });

    if (user.roles.length > 0) {
        // Need _id of existing user record so this call must come
        // after `Accounts.createUser` or `Accounts.onCreate`
        Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
    }

});

// Some hack so we can see all emails
Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields: {"emails.address": 1}});
});

Meteor.users.allow({
    update: function () {
        return Roles.userIsInRole(Meteor.userId(), 'admin');
    },
    remove: function (userId, doc) {
        return Roles.userIsInRole(Meteor.userId(), 'admin');
    },
    fetch: []
});
