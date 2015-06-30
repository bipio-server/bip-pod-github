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

function OrgRepoCreated() {}

OrgRepoCreated.prototype = {};

OrgRepoCreated.prototype.getUrl = function(channel, auth) {
  var path = '/orgs/' + imports.organization + '/repos', 
    type = 'public';

  if (!imports.public_only) {
    type = 'all';
  }

  return 'https://api.github.com' + path + '?sort=created&type=' + type + '&access_token=' + auth.oauth.access_token
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