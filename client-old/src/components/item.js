import React, { Component } from "react";
import ItemDataService from "../apiclient/todolist";
export default class Item extends Component {
  constructor(props) {
    super(props);
    this.onChangeTaskName = this.onChangeTaskName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.getItem = this.getItem.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.state = {
      currentItem: {
        id: null,
        taskname: "",
        description: "",
        status: "",
        duedate: ""
      },
      message: ""
    };
  }
  componentDidMount() {
    this.getItem(this.props.match.params.id);
  }
  onChangeTaskName(e) {
    const taskname = e.target.value;
    this.setState(function(prevState) {
      return {
        currentItem: {
          ...prevState.currentItem,
          taskname: taskname
        }
      };
    });
  }
  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(prevState => ({
      currentItem: {
        ...prevState.currentItem,
        description: description
      }
    }));
  }
  onChangeDueDate(e) {
    const duedate = e.target.value;

    this.setState(prevState => ({
      currentItem: {
        ...prevState.currentItem,
        duedate: duedate
      }
    }));
  }
  getItem(id) {
    ItemDataService.get(id)
      .then(response => {
        this.setState({
          currentItem: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  updateStatus(status) {
    var data = {
      id: this.state.currentItem.id,
      taskname: this.state.currentItem.taskname,
      description: this.state.currentItem.description,
      duedate: this.state.currentItem.duedate,
      status: status
    };
    ItemDataService.update(this.state.currentItem.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentItem: {
            ...prevState.currentItem,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  updateItem() {
    ItemDataService.update(
      this.state.currentItem.id,
      this.state.currentItem
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The Item was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
  deleteItem() {
    ItemDataService.delete(this.state.currentItem.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/items')
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    const { currentItem } = this.state;
    return (
      <div>
        {currentItem ? (
          <div className="edit-form">
            <h4>Item</h4>
            <form>
              <div className="form-group">
                <label htmlFor="taskname">TaskName</label>
                <input
                  type="text"
                  className="form-control"
                  id="taskname"
                  value={currentItem.taskname}
                  onChange={this.onChangeTaskName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="duedate">Due Date</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.duedate}
                  onChange={this.onChangeDueDate}
                />
              </div>
              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentItem.status ? "Completed" : "Pending"}
              </div>
            </form>
            {currentItem.status ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateStatus(false)}
              >
                Undo
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Mark Completed
              </button>
            )}
            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteItem}
            >
              Delete
            </button>
            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateItem}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Item...</p>
          </div>
        )}
      </div>
    );
  }
}
