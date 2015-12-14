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