/**
 *
 * The Bipio Github Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function OrgRepoCreated(podConfig) {
  this.name = 'new_org_repos';
  this.title = 'Organization Repository Created',
  this.description = 'A new Organization Repository has been created',
  this.trigger = true; // this action can trigger
  this.singleton = false; // only 1 instance per account (can auto install)
  this.auto = false; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

OrgRepoCreated.prototype = {};

OrgRepoCreated.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "organization" : {
          "type" :  "string",
          "description" : "Organization Name"
        },

        "public_only" : {
          "type" :  "boolean",
          "description" : "Public Repositories only",
          "default" : true
        }
      }
    },
    "imports": {
      "properties" : {
    }
    },
    "exports": {
      "properties" : {
        "organization" : {
          "type" : "string",
          "description" : "Organization Name"
        },
        "id" : {
          "type" : "string",
          "description" : "ID"
        },
        "name" : {
          "type" : "string",
          "description" : "Name"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
        },
        "private" : {
          "type" : "booelan",
          "description" : "Is Private"
        },
        "url" : {
          "type" : "string",
          "description" : "URL"
        },
        "html_url" : {
          "type" : "string",
          "description" : "Site URL"
        },
        "watchers_count" : {
          "type" : "integer",
          "description" : "# Watchers"
        },
        "stargazers_count" : {
          "type" : "integer",
          "description" : "# Stargazers"
        },
        "open_issues_count" : {
          "type" : "integer",
          "description" : "# Issues"
        }
      }
    }
  }
}

OrgRepoCreated.prototype.getUrl = function(channel, auth) {
  var path = '/user/repos', type = 'public';

  if (channel.config.organization && '' !== channel.config.organization) {
    path = '/orgs/' + channel.config.organization + '/repos'
  }

  if (!channel.config.public_only) {
    type = 'all';
  }

  return 'https://api.github.com' + path + '?sort=created&type=' + type + '&access_token=' + auth.oauth.token
}

OrgRepoCreated.prototype.setup = function(channel, accountInfo, next) {
  var resource = this.$resource,
  self = this,
  dao = resource.dao,
  log = resource.log,
  modelName = resource.getDataSourceName('track_repos'),
  url = this.getUrl(channel, accountInfo._setupAuth);

  resource._httpGet(url, function(err, repos, headers) {
    var repoStruct;
    if (!err) {
      for (var i = 0; i < repos.length; i++) {
        (function(repoStruct, accountInfo) {
          var model = dao.modelFactory(modelName, repoStruct, accountInfo);
          dao.create(model, function(err, result) {
            if (err) {
              log(err, channel, 'error');
            }
          }, accountInfo);
        })({
            channel_id : channel.id,
            last_update : resource.moment(repos[i].updated_at).unix(),
            owner_id : channel.owner_id,
            repo_id : repos[i].id,
            data : repos[i]
          },
          accountInfo
        );

      }
    }
    next(err, 'channel', channel);
  });
}

OrgRepoCreated.prototype.teardown = function(channel, accountInfo, next) {
  var resource = this.$resource,
  self = this,
  dao = resource.dao,
  log = resource.log,
  modelName = resource.getDataSourceName('track_repos');

  dao.removeFilter(
    modelName,
    {
      channel_id : channel.id,
      owner_id : channel.owner_id
    },
    function(err) {
      if (err) {
        log(err, channel, 'error');
      }
      next(err, modelName, null);
    }
    );
}


OrgRepoCreated.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    pod = this.pod,
    resource = this.$resource,
    dao = resource.dao,
    log = resource.log,
    url = this.getUrl(channel, sysImports.auth),
    modelName = this.$resource.getDataSourceName('track_repos');

  resource._httpGet(url, function(err, repos, headers) {
    if (!err) {
      for (var i = 0; i < repos.length; i++) {
        (function(channel, repo, next) {
          dao.findFilter(modelName,
            {
              owner_id : channel.owner_id,
              channel_id : channel.id,
              repo_id : repos[i].id
            }, function(err, results) {
              if (err) {
                next(err);
              } else if (results.length === 0) {
                var repoStruct = {
                  channel_id : channel.id,
                  last_update : resource.moment(repo.updated_at).unix(),
                  owner_id : channel.owner_id,
                  repo_id : repo.id,
                  data : repo
                };

                var model = dao.modelFactory(modelName, repoStruct);
                dao.create(model, function(err, result) {
                  if (err) {
                    log(err, channel, 'error');
                  }
                });
                next(false, repo);
              }
            }
          );
        })(channel, repos[i], next);
      }
    } else {
      next(err);
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OrgRepoCreated;