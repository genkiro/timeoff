console.log('server file');

var users = [
    {name:"Manager",email:"manage@example.com",roles:['manager'],password:'golaprint1'},
    {name:"Admin",email:"admin@example.com",roles:['admin'],password:'thinkexponential'}
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
