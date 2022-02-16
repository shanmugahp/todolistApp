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
import { Header, Icon, Message, Table , Checkbox, Button,Radio,Form} from 'semantic-ui-react';

import config from '../config';
import {Link} from "react-router-dom";

const Tasks = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [tasks, setTasks] = useState(null);
   const [taskSubmitFailed, setTaskSubmitFailed] = useState(false);

  const [formData, setFormData] = useState({
    id: ""
  })
  const [taskFetchFailed, setTaskFetchFailed] = useState(false);

  // fetch tasks
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.resourceServer.baseUrl+"/tasks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((data) => {
          const formattedTasks = data.map((task) => {
            const date = task.duedate.substr(0, task.duedate.indexOf('T'));
            const overdue=new Date() > new Date(date) ? 'true' : 'false'
            return {
              duedate: date,
              taskname: task.taskname,
              status: task.status,
              description: task.description,
              overdue: overdue,
              id: task.id,
            };
          });
          setTasks(formattedTasks);
          setTaskFetchFailed(false);
        })
        .catch((err) => {
          setTaskFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  const possibleErrors = [
    'Check if resource server is running at port 8081.',
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
  ];
  const handleDeleteClick = (event) => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      console.log(formData)
      const id = formData.id // 123
      fetch(config.resourceServer.baseUrl+"/tasks/"+id, {
        method: 'DELETE',
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
          window.location.href = 'http://localhost:8080/';
        })

                 .catch((err) => {
                     setTaskSubmitFailed(true);
                     /* eslint-disable no-console */
                     console.error(err);
                 });
    }
  }
  const handleUpdateClick = (event) => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      const id = formData.id // 123
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
          window.location.href = 'http://localhost:8080/';
        })

                 .catch((err) => {
                     setTaskSubmitFailed(true);
                     /* eslint-disable no-console */
                     console.error(err);
                 });
    }
  }

const handleChange = (event, {value}) => {
    //const value = event.target.value;
      setFormData({'id': value});

  }
  return (
    <div>
      <Header as="h1">
        <Icon name="tasks" />
        My Tasks
      </Header>
      {taskFetchFailed && <Task error header="Failed to fetch tasks.  Please verify the following:" list={possibleErrors} />}
      {!tasks && !taskFetchFailed && <p>Fetching Tasks..</p>}
      {tasks
      && (
      <div>
        <Form>
        <Table  celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>TaskName</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>

            {tasks.map((task) => (
              <Table.Row class={task.overdue === 'true' ? 'error':'success'} id={task.id} key={task.id}>
                <Table.Cell collapsing>
                  <Form.Field>
                  <Radio name='id' onChange={handleChange} value={task.id} label='' />
                  </Form.Field>
                </Table.Cell>
                <Table.Cell>{task.id}</Table.Cell>
                <Table.Cell>{task.taskname}</Table.Cell>
                <Table.Cell>{task.description}</Table.Cell>
                <Table.Cell>{task.status ? 'Completed':'Pending'}</Table.Cell>
                <Table.Cell>{task.duedate}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer fullWidth>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell colSpan='5'>

          <Button inverted color='green' size='small' onClick={handleUpdateClick} type='submit'>Mark Completed</Button>
          <Button inverted color='red' size='small' onClick={handleDeleteClick} type='submit'>
        Delete Task
        </Button>

          <Link to="/addtask"><Button
            floated='right'
            icon
            labelPosition='left'
            primary
            size='small'
          >
            <Icon name='tasks' /> Add Task
          </Button></Link>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
        </Table>
 </Form>
      </div>
      )}
    </div>
  );
};

export default Tasks;
