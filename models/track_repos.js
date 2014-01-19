/**
 * 
 * Stores metadata for a syndication subscribe
 * 
 */
RepoTracking = {};
RepoTracking.entityName = 'track_repos';
RepoTracking.entitySchema = {
    id: {
        type: String,
        renderable: false,
        writable: false
    },
    owner_id : {
        type: String,
        renderable: false,
        writable: false
    },
    
    created : {
        type: String,
        renderable: true,
        writable: false
    },

    last_update : {
        type : String,
        renderable : true,
        writable : false
    },
    
    channel_id : {
        type : String,
        renderable : true,
        writable : false
    },
    
    repo_id : {
        type : String,
        renderable : true,
        writable : false
    },
    
    data : {
      type : Object,
      rendrable : true,
      writable : true
    }
};

module.exports = RepoTracking;