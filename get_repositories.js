/**
 *
 * The Bipio Github Pod
 * ---------------------------------------------------------------
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function UserRepoCreated() {}

UserRepoCreated.prototype = {};


UserRepoCreated.prototype.getUrl = function(channel, auth) {
  var path = '/user/repos', type = 'public';

  if (channel.config.owner && '' !== channel.config.owner) {
    path = '/users/' + channel.config.owner + '/repos'
  }

  if (!channel.config.public_only) {
    type = 'all';
  }

  return 'https://api.github.com' + path + '?sort=created&type=' + type + '&access_token=' + auth.oauth.access_token
}

UserRepoCreated.prototype.setup = function(channel, accountInfo, next) {
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

UserRepoCreated.prototype.teardown = function(channel, accountInfo, next) {
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


UserRepoCreated.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
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
module.exports = UserRepoCreated;