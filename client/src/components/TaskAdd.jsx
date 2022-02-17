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
import {Header, Form, Button, Icon} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import config from '../config';

export default function Tasks() {
    const { authState, oktaAuth } = useOktaAuth();
 const [startDate, setStartDate] = useState(new Date());
 const [taskSubmitFailed, setTaskSubmitFailed] = useState(false);
 const [formData, setFormData] = useState({
    taskname: "",
    description: "",
    duedate:new Date().toISOString().split('T')[0]
  })
     const saveTasks = () => {
         if (authState && authState.isAuthenticated) {
             const accessToken = oktaAuth.getAccessToken();

             fetch(config.resourceServer.baseUrl+"/tasks", {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${accessToken}`,
                 },
                 body: JSON.stringify(
                     formData
                 ),
             })
                 .then((res) => res.json())
                 .then((result) => window.location.href = 'http://localhost:8080/')
                 .catch((err) => {
                     setTaskSubmitFailed(true);
                     /* eslint-disable no-console */
                     console.error(err);
                 });
         }
     }

   const handleSubmit = (event) => {
    event.preventDefault()
    // const formData = new FormData(event.target);
    // formData.set('taskname', formData.get('taskname'));
    // formData.set('description', formData.get('description'));
    // formData.set('duedate', formData.get('duedate'));

    saveTasks() // Save tasks when form is submitted
  }

  const handleChange = (event) => {
    const value = event.target.value;
      setFormData({
        ...formData,
        [event.target.name]: value
      });

  }
  const onChangeEvent = (event) => {
        console.log(event);
        this.setState({ selectedDate: event });
    };
  return (
    <div className="Tasks">
        <Header as="h1">
        <Icon name="tasks" />
        Add a new Task
      </Header>
        <Form name="saveTasks" onSubmit={handleSubmit}>
    <Form.Field>
      <label>Task Name</label>
      <input name="taskname" onChange={handleChange} placeholder='Task Name' />
    </Form.Field>
    <Form.Field>
      <label>Task Description</label>
      <input name="description" onChange={handleChange} placeholder='Task Description' />
    </Form.Field>
          <Form.Field>
      <label>Task Due Date</label>
      <DatePicker name="duedate" selected={startDate} onChange={(date) => {setStartDate(date);setFormData({
        ...formData,
        duedate: date
      });}} />
    </Form.Field>

    <Button inverted color='blue' size='small' type='submit'>Add Task</Button>
  </Form>



      </div>
  );
};


