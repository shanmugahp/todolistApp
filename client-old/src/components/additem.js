import React, { Component } from "react";
import ItemsDataService from "../apiclient/todolist";
export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.onChangeTaskName = this.onChangeTaskName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.newItem = this.newItem.bind(this);
    this.state = {
      id: null,
      taskname: "",
      description: "",
      status: false,
      duedate: "",
      submitted: false
    };
  }
  onChangeTaskName(e) {
    this.setState({
      taskname: e.target.value
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeDueDate(e) {
    this.setState({
      duedate: e.target.value
    });
  }
  saveItem() {
    var data = {
      taskname: this.state.taskname,
      description: this.state.description,
      duedate: this.state.duedate
    };
    ItemsDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          taskname: response.data.taskname,
          description: response.data.description,
          status: response.data.status,
          duedate: response.data.duedate,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newItem() {
    this.setState({
      id: null,
      taskname: "",
      description: "",
      duedate: "",
      status: false,
      submitted: false
    });
  }
  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newItem}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="taskname">TaskName</label>
              <input
                type="text"
                className="form-control"
                id="taskname"
                required
                value={this.state.taskname}
                onChange={this.onChangeTaskName}
                name="taskname"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Due Date</label>
              <input
                type="text"
                className="form-control"
                id="duedate"
                required
                value={this.state.duedate}
                onChange={this.onChangeDueDate}
                name="duedate"
              />
            </div>
            <button onClick={this.saveItem} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}