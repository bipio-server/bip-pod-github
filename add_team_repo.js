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

function AddTeamRepo() {}

AddTeamRepo.prototype = {};

AddTeamRepo.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    pod = this.pod,
    resource = this.$resource,
    dao = resource.dao,
    log = resource.log,
    url;

  url = 'https://api.github.com/teams/'+ imports.id +'/repos/' + imports.org + '/' + imports.repo + '?access_token=' + sysImports.auth.oauth.access_token;
  resource._httpPut(url, null, function(err, repo, headers) {
    next(err, { status : headers.status });
  });

}

// -----------------------------------------------------------------------------
module.exports = AddTeamRepo;