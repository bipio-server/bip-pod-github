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

function OrgRepoCreated() {}

OrgRepoCreated.prototype = {};

OrgRepoCreated.prototype.getUrl = function(imports, auth) {
  var path = '/orgs/' + imports.organization + '/repos',
    type = 'public';

  if (!imports.public_only) {
    type = 'all';
  }

  return 'https://api.github.com' + path + '?sort=created&type=' + type + '&access_token=' + auth.oauth.access_token
}

OrgRepoCreated.prototype.trigger = function(imports, channel, sysImports, contentParts, next) {
  var $resource = this.$resource;

  this.invoke(imports, channel, sysImports, contentParts, function(err, exports) {
    if (err) {
      next(err);
    } else {
      $resource.dupFilter(exports, 'id', channel, sysImports, function(err, repo) {
        repo.organization = repo.owner.login;
        next(err, repo);
      });
    }
  });
};

OrgRepoCreated.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    resource = this.$resource,
    url = this.getUrl(imports, sysImports.auth);

  resource._httpGet(url, function(err, repos, headers) {
    if (!err) {
      for (var i = 0; i < repos.length; i++) {
        next(false, repos[i]);
      }
    } else {
      next(err);
    }
  });
}

// -----------------------------------------------------------------------------
module.exports = OrgRepoCreated;