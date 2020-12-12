let db = {
    users: [
        {
            userId: 'dfg486pjkunhk45',
            handle: 'user',
            email: 'user@email.com',
            createdAt: '2020-12-12T14:35:19.504Z',
            imageUrl: 'image/fhrifhrifhirir/ufifo',
            bio: 'Hellooo, nice to meet you!',
            website: 'http://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-12-12T14:35:19.504Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'dugih43467',
            body: 'nice',
            createdAt: '2020-12-12T14:35:19.504Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'dfg486pjkunhk45',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2020-12-12T14:35:19.504Z',
        imageUrl: 'image/fhrifhrifhirir/ufifo',
        bio: 'Hellooo, nice to meet you!',
        website: 'http://user.com',
        location: 'London, UK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'dugih43467'
        },
        {
            userHandle: 'user',
            screamId: 'gyminb5nm3'
        }
    ]
};