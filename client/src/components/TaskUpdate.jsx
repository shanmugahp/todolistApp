/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table , Checkbox, Button} from 'semantic-ui-react';

import config from '../config';

const Tasks = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [messages, setMessages] = useState(null);
  const [messageFetchFailed, setMessageFetchFailed] = useState(false);

  // fetch messages
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      const params = new URLSearchParams(window.location.search) // id=123
      let id = params.get('id') // 123
      fetch(config.resourceServer.baseUrl+"/tasks/"+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(
            {status:true},
        ),
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((res) => res.json())
                 .then((result) => window.location.href = 'http://localhost:8080/')
                 .catch((err) => {
                     setTaskSubmitFailed(true);
                     /* eslint-disable no-console */
                     console.error(err);
                 });
    }
  }, [authState]);

};

export default Tasks;
