const { db } = require('../util/admin');

exports.getAllScreams = (request, response) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(document => {
            screams.push({
                screamId: document.id,
                body: document.data().body,
                userHandle: document.data().userHandle,
                createdAt: document.data().createdAt,
                commentCount: document.data().commentCount,
                likeCount: document.data().likeCount,
                userImage: document.data().userImage
            }); 
        });
        return response.json(screams);
    })
    .catch(err => console.error(err));
};

exports.postOneScream = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Body must not be empty' });
    }
    const newScream = {
        body: request.body.body,
        userHandle: request.user.handle,
        createdAt: new Date().toISOString(),
        userImage: request.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    };

    db
    .collection('screams')
    .add(newScream)
    .then(doc => {
        newScream.screamId = doc.id;
        response.json(newScream);
    })
    .catch(err => {
        res.status(500).json({ error: "Error adding new scream" });
        console.error(err);
    });
};

exports.getScream = (req, res) => {
    let screamData = {};

    db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Scream not found!'} );
        }

        screamData = doc.data();
        screamData.screamId = doc.id;

        return db.collection('comments').where('screamId', '==', req.params.screamId)
        .get();
    })
    .then((docs) => {
        screamData.comments = [];
        docs.forEach((doc) => {
            screamData.comments.push(doc.data());
        });
        return res.json(screamData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
};

exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '') 
        return res.status(400).json({ comment: "must not be empty" });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    let screamData;

    db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ comment: 'Scream not found!'} );
        }

        screamData = doc.data();
        screamData.screamId = doc.id;
        
        return doc.ref.update({ commentCount: doc.data().commentCount + 1});
    })
    .then(() => {
        return db.collection('comments').add(newComment);
    })
    .then(doc => {
        if(screamData.userHandle !== req.user.handle) {
            return db.doc(`/notifications/${doc.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: screamData.userHandle,
                sender: req.user.handle,
                type: 'comment',
                read: false,
                screamId: screamData.screamId
            })
        }
    })
    .then(() => {
        res.json(newComment);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    })
};

exports.likeScream = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId);
    
    const screamDocument = db.doc(`screams/${req.params.screamId}`);

    let screamData;
    screamDocument.get()
        .then(doc => {
            console.log('here')
            console.log(req.params)
            if(doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;

                return likeDocument.get();
            } else {
                return res.status(404).json( { error: 'Scream not found.' });
            }
        })
        .then(data => {
            if (data.empty) {
                db.collection('likes').add({
                    userHandle: req.user.handle,
                    screamId: screamData.screamId
                })
                .then(doc => {
                    if(screamData.userHandle !== req.user.handle) {
                        return db.doc(`/notifications/${doc.id}`).set({
                            createdAt: new Date().toISOString(),
                            recipient: screamData.userHandle,
                            sender: req.user.handle,
                            type: 'like',
                            read: false,
                            screamId: screamData.screamId
                        })
                    }
                })
                .then(() => {
                    screamData.likeCount ++;
                    return screamDocument.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    return res.json(screamData);
                });
            } else {
                return res.status(400).json({ error: 'Scream already liked.'});
            }
        })
        .catch(error => {
            console.log("error liking scream", error);
            res.status(500).json({ error });
        });     
}

exports.unlikeScream = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`screams/${req.params.screamId}`);

    let screamData;

    screamDocument.get()
        .then(doc => {
            if(doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;

                return likeDocument.get();
            } else {
                return res.status(404).json( { error: 'Scream not found.' });
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({ error: 'Scream not liked.'});
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                       return db.doc(`/notifications/${data.docs[0].id}`).delete()
                    })
                    .then(() => {
                        res.json(screamData);
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        });
}

exports.deleteScream = (req, res) => {
    const document = db.doc(`/screams/${req.params.screamId}`);

    document.get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Scream not found.' });
            }

            if(doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            const screamId = req.params.screamId;
            const batch = db.batch();
    
            return db.collection('comments').where('screamId', '==', screamId)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/comments/${doc.id}`));
                    })
    
                    return db.collection('likes').where('screamId', '==', screamId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/likes/${doc.id}`));
                    })
    
                    return db.collection('notifications').where('screamId', '==', screamId).get();
                })
                .then(data => {
                    data.forEach(doc => {
                        batch.delete(db.doc(`/notifications/${doc.id}`));
                    })
    
                    return batch.commit();
                })
        })
        .then(() => {
            res.json({ message: 'Scream deleted successfully!' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}