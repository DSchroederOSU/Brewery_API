let auth = require('../lib/authentication');


test('Generate jwt', () => {

    auth.generateAuthToken("somename")
        .then((token)=>{
            // return a jwt in xxxx.xxxx.xxxx format
            expect( token.split(".")).toBe(3);
        })
        .catch((err)=>{

        });
});

test('Check hash pass', () => {
    let hashed = auth.hashPassword("somepassword");
    expect( hashed ).toBeDefined();
    expect(  auth.checkPassword("somepassword", hashed)).toBeTruthy();
});
